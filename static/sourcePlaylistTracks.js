
async function sourcePlaylist_tracks() {
    try{
        const sourcePlaylist = document.getElementById("allPlaylists")
        const button = document.querySelector("#selectSourcePlaylist")
        button.addEventListener('click', async() => {
            try {
        const container = document.getElementById('radio-select-song-source');
        const response = await fetch('/api/getsourceid/alltracks');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const source_track_data = await response.json();
        
        for (let i = 0; i < source_track_data.length; i++) {
            const input = document.createElement("input");
            input.type = "radio"
            select.appendChild(input);
             }
    }
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
        });
    
        
        
    }

    catch (error) {
        console.error("Failed to fetch data:", error);
}
}



sourcePlaylist_tracks();