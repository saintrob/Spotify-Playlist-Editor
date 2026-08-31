import os
import spotipy
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from spotipy.oauth2 import SpotifyOAuth
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

    
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
templates = Jinja2Templates(directory="templates")

scope = "playlist-read-private user-library-read playlist-modify-public playlist-modify-private playlist-read-collaborative user-library-modify playlist-read-collaborative"


# OAuth Authentication
sp_oauth = SpotifyOAuth(
    client_id=os.getenv("env_client_id"),
    client_secret=os.getenv("env_client_secret"),
    redirect_uri=os.getenv("env_redirect_uri"),
    scope=scope
)
sp = spotipy.Spotify(auth_manager=sp_oauth)


class SourcePlaylistData(BaseModel):
    source_playlist_id: str

class TargetPlaylistData(BaseModel):
    target_playlist_id: str
    selected_song_ids: list[str]


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request":request, "title": "welcome", "message": "fastapi backend"}
        )

@app.get("/login")
async def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(url=auth_url)

@app.get("/callback")
async def callback(code: str):
    sp_oauth.get_access_token(code)
    return RedirectResponse("/") 

@app.get("/api/getallplaylists")
async def list_all_playlist():
    playlists = sp.current_user_playlists()
    all_playlist = []
    playlist_count = 0
    while playlists:
        for playlist in playlists['items']:
            all_playlist.append(playlist)
            playlist_count += 1
        if playlists['next']:
            playlists = sp.next(playlists)
        else:
            playlists = None
            print("GET playlist success.")
            return all_playlist


    
@app.post("/api/getsourceid")
async def getSourceId_javascript(data: SourcePlaylistData):
    print(f"ID is {data.source_playlist_id}")
    source_id = data.source_playlist_id
    tracks = sp.playlist_items(source_id)
    song_count = 0
    all_tracks = []
    while tracks:
        if tracks['items'] == []:
            
            return []
        for track in tracks['items']:
            all_tracks.append(track)
            song_count += 1
            
        if tracks['next']:
            tracks = sp.next(tracks)
        else:
            tracks = None
            return all_tracks
    
    
@app.get("/api/source_alltracks")
# Get all of the tracks/items of the source playlist selected by the user
async def source_playlist_tracks(data: SourcePlaylistData):
    source_id = data.source_playlist_id
    song_count = 0
    all_tracks = []
    tracks = sp.playlist_items(source_id)
    while tracks:
        if tracks['items'] == []:
            return []
        for track in tracks['items']:
            all_tracks.append(track)
            song_count += 1
        if tracks['next']:
            tracks = sp.next(tracks)
        else:
            tracks = None
            return all_tracks
        
@app.post("/api/transfersongs")
async def transfer_songs(data: TargetPlaylistData):
    track_ids = data.selected_song_ids
    sp.playlist_add_items(data.target_playlist_id, track_ids)
    return {"added": len(track_ids), "target_id": data.target_playlist_id}



