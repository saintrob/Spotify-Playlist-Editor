import os
import spotipy
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from spotipy.oauth2 import SpotifyOAuth
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

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

scope = "playlist-read-private" "user-library-read" "playlist-modify-public" "playlist-modify-private" "playlist-read-collaborative" "user-library-modify"


# OAuth Authentication
sp_oauth = SpotifyOAuth(
    client_id=os.getenv("env_client_id"),
    client_secret=os.getenv("env_client_secret"),
    redirect_uri=os.getenv("env_redirect_uri"),
    scope=scope
)
sp = spotipy.Spotify(auth_manager=sp_oauth)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request":request, "title": "welcome", "message": "fastapi backend"}
        )


@app.get("/login")
async def login():
    auth_url = sp_oauth.get_authorize_url()
    return RedirectResponse(url=auth_url)

#testing ping endpoint
@app.get("/ping")
async def ping():
    return {"message": "Pong!"}

def list_all_playlist():
    playlists = sp.current_user_playlists()
    all_playlist = []
    playlist_count = 0
    while playlists:
        for playlist in playlists['items']:
            all_playlist.append(playlist)
            playlist_count += 1
            print(playlist_count, f"{playlist['name'], playlist['id']}")
        if playlists['next']:
            playlists = sp.next(playlists)
        else:
            playlists = None
            return all_playlist



# Asks the user to choose the source playlist.
def select_source_playlist():
    all_playlist = list_all_playlist()
    while True:
        try:
            pick = int(input("Choose Source Playlist: "))
            if 1 <= pick <= len(all_playlist):
                source_id = all_playlist[pick-1]['id']
                return source_id
        except ValueError:
            pass
        print("Invalid Choice, Please Try Again")


def select_target_playlist(source_id):
    all_playlist = list_all_playlist()
    while True:
        try:
            pick = int(input("Choose Target Playlist: "))
            if 1 <= pick <= len(all_playlist):
                target_select = all_playlist[pick-1]
                if target_select['id'] == source_id:
                    print("Cannot choose the same playlist. Try again.")
                else:
                    return target_select
        except ValueError:
            pass
        print("Invalid Choice, Please Try Again")


# Get all of the tracks/items of the source playlist selected by the user
def source_playlist_tracks(source_id):
    song_count = 0
    all_tracks = []
    tracks = sp.playlist_items(source_id)
    while tracks:
        if tracks['items'] == []:
            print("Playlist is empty. Choose another source playlist.")
            return []
        for track in tracks['items']:
            all_tracks.append(track)
            song_count += 1
            print(song_count, f"{track['item']['name']} - {track['item']['artists'][0]['name']}")
        if tracks['next']:
            tracks = sp.next(tracks)
        else:
            return all_tracks


def target_playlist_tracks(target):
    target_playlist_id = target['id']
    all_tracks = []
    tracks = sp.playlist_items(target_playlist_id)
    while tracks:
        for track in tracks['items']:
            all_tracks.append(track)
        if tracks['next']:
            tracks = sp.next(tracks)
        else:
            return all_tracks


def select_songs(all_tracks):
    song_select = []
    selected_song_id = []

    while True:
        try:
            pick = (input("Choose Songs from the Source Playlist // (done,exit,undo) ")).lower()
            if pick == "done":
                if song_select == []:
                    print("No songs selected. Please select at least one song.")
                else:
                    return selected_song_id
            elif pick == "undo":
                if song_select == []:
                    print("cannot undo empty list. Please select another song or type 'done' to finish.")
                else:
                    song_select.pop()
                    selected_song_id.pop()
                    print("Last song removed from selection.")

            elif pick == 'exit':
                exit()

            pick = int(pick)
            if 1 <= pick <= len(all_tracks):
                if all_tracks[pick-1]['item']['id'] not in selected_song_id:
                    song_select.append(all_tracks[pick-1])
                    selected_song_id.append(all_tracks[pick-1]['item']['id'])
                    for song in song_select:
                        print(song['item']['name'])
                else:
                    print("Song is already selected. Choose another song or type 'Done'.")

        except ValueError:
            print("Invalid Choice, Please Try Again")


def transfer_songs(selected_song_id, source_id, target):
    target_id_check = target_playlist_tracks(target)
    target_ids = []

    for track in target_id_check:
        target_ids.append(track['item']['id'])

    duplicates_found = any(id in target_ids for id in selected_song_id)

    if duplicates_found:
        while True:
            user_input = input("This playlist contains duplicates of the song(s) you are copying. Would you still like to continue? (Y/N) ").lower()
            if user_input == "y":
                sp.playlist_add_items(target['id'], selected_song_id)
                print(f"{len(selected_song_id)} song(s) successfully copied.")
                return
            elif user_input == "n":
                source_playlist_tracks(source_id)
                select_songs(all_tracks)
                
            else:
                print("Not a valid answer. Please enter Y or N.")
    else:
        sp.playlist_add_items(target['id'], selected_song_id)
        print(f"{len(selected_song_id)} song(s) successfully copied.")
        




# CLI Execution for testing purposes:

# source = select_source_playlist()
# tracks = source_playlist_tracks(source)
# selected = select_songs(tracks)
# target = select_target_playlist(source['id'])
# transfer_songs(selected, source['id'], target)








