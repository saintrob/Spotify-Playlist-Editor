
// The function calls the FastAPI route "/getallplaylists" and GETS the playlists data as a JSON
// Shows all the user's created / saved playlists on to website.
async function GetPlaylist() {
    try {
        const select = document.getElementById("allPlaylists");
        const response = await fetch('http://127.0.0.1:8000/api/getallplaylists');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const PlaylistData = await response.json();
        
        for (let i = 0; i < PlaylistData.length; i++) {
            const opt = document.createElement("option");
            opt.value = PlaylistData[i]["id"]
            opt.textContent = PlaylistData[i]["name"] 
            select.appendChild(opt);
             }
    }
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

GetPlaylist();
