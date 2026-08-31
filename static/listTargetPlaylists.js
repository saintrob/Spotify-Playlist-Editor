
// The function calls the FastAPI route "/getallplaylists" and GETS the playlists data as a JSON
// Shows all the user's created / saved playlists on to website.
async function listTargetPlaylists() {
    try {
        const select = document.getElementById("allTargetPlaylists");
        const sourceId = document.getElementById("allPlaylists").value;
 
        const response = await fetch('/api/getallplaylists');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const PlaylistData = await response.json();
        select.length = 1;
 
        for (let i = 0; i < PlaylistData.length; i++) {
            if (PlaylistData[i]["id"] === sourceId) continue;
 
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
 
listTargetPlaylists();
 
document.getElementById("allPlaylists")
        .addEventListener("change", listTargetPlaylists);