

async function selectSource() {
    try{
        const button = document.querySelector("#selectSourcePlaylist")
        const sourcePlaylist = document.getElementById("allPlaylists")
        button.addEventListener('click', function(){
            let source_id = sourcePlaylist["value"]
            console.log(source_id);
            return source_id;
        });
    }
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
}


async function sourcePlaylist() {
    try{
        
        const sourcePlaylist = document.getElementById("allPlaylists")
        const button = document.querySelector("#selectSourcePlaylist")
        let source_id = null
        button.addEventListener('click', async() => {
            source_id = sourcePlaylist["value"]
            const payload = 
            {source_playlist_id: source_id};

            try{
                const response1 = await fetch("http://127.0.0.1:8000/api/getsourceid", {method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" // Alert FastAPI that JSON is coming
                },
                body: JSON.stringify(payload)
                });
                const result = await response1.json();
                console.log(result);
                const response2 = await fetch('http://127.0.0.1:8000/api/source_alltracks');
                if (!response2.ok) {
                throw new Error(`HTTP error! Status: ${response2.status}`);
                }
                const source_track_data = await response2.json();
                console.log(source_track_data)
            }
            catch (error) {
                console.error('Error sending request:', error);
            }
        });
    
        
        
    }

    catch (error) {
        console.error("Failed to fetch data:", error);
}
}

async function sourcePlaylist_tracks() {
    try {
        const container = document.getElementById('radio-select-song-source');
        const response = await fetch('http://127.0.0.1:8000/api/getsourceid/alltracks');
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
}


selectSource();
sourcePlaylist();

