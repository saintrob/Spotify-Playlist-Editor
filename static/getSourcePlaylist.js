

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
        const container = document.getElementById('checkbox-select-song-source');
        let source_id = null
        button.addEventListener('click', async() => {
            
            source_id = sourcePlaylist["value"]
            const payload = 
            {source_playlist_id: source_id};
            container.replaceChildren()
            try{
                const response = await fetch("http://127.0.0.1:8000/api/getsourceid", {method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" // Alert FastAPI that JSON is coming
                },
                body: JSON.stringify(payload)
                });
                const result = await response.json();
                console.log(result);
                

                for (let i = 0; i < result.length; i++) {

                    
                    const input = document.createElement("input");
                    input.type = "checkbox";
                    input.name = "source_tracks";
                    input.id = `checkbox-${i}`;
                    input.value = result[i]["item"]["id"];


                    const label = document.createElement("label");
                    label.htmlFor = `checkbox-${i}`;  
                    label.textContent = result[i]["item"]["name"] + " - " + result[i]["item"]["artists"][0]["name"] ;

                    const wrapper = document.createElement("div");
                    wrapper.append(input);
                    wrapper.append(label);

                    container.append(wrapper);
                    console.log(result[i]["item"]["name"])
                    }
                    
                
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
        const container = document.getElementById('checkbox-select-song-source');
        const response = await fetch('http://127.0.0.1:8000/api/getsourceid/alltracks');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const source_track_data = await response.json();
        
        for (let i = 0; i < source_track_data.length; i++) {
            const input = document.createElement("input");
            input.type = "checkbox"
            container.appendChild(input);
             }
    }
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
}


selectSource();
sourcePlaylist();

