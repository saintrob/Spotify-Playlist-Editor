async function selectSourceTracks() {
    try{
        const button = document.querySelector("#selectSourceTracks_button")
        const container = document.getElementById('checkbox-select-song-source');
        button.addEventListener('click', () => {
            console.log("revieved")
        
    }
)}
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
}
selectSourceTracks();