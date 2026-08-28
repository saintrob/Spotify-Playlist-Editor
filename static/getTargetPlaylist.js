async function selectTarget() {
    try{
        
        const button = document.querySelector("#selectTargetPlaylist")
        const targetPlaylist = document.getElementById("allTargetPlaylists")
        button.addEventListener('click', function(){
            event.preventDefault(); 
            let target_id = targetPlaylist["value"]
            console.log(target_id);
            return target_id;
        });
    }
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

selectTarget();