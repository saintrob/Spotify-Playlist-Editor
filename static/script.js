async function GetPlaylist() {
    try {
        const response = await fetch('http://127.0.0.1:8000/getallplaylists');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const PlaylistData = await response.json();
        console.log(PlaylistData);
    }
    catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

GetPlaylist();
