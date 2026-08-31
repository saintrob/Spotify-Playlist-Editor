async function TransferSongs() {
    try{
        
        let target_id = null
        const confirmButton = document.getElementById('selectTargetPlaylist');
        confirmButton.addEventListener('click', async () => {
            event.preventDefault(); 
            const checkedBoxes = document.querySelectorAll('input[name="source_tracks"]:checked');
            const selectedSongID = Array.from(checkedBoxes).map(cb => cb.value);
            
            const targetPlaylist = document.getElementById("allTargetPlaylists")
        
            target_id = targetPlaylist["value"]
            const payload = 
                {
                target_playlist_id: target_id,
                selected_song_ids: selectedSongID
                };
            
            try{
                const response = await fetch("/api/transfersongs", {method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" // Alert FastAPI that JSON is coming
                },
                body: JSON.stringify(payload)
                });
                const result = await response.json();
                console.log(result);
                
            }
            catch (error) {
                console.error('Error sending request:', error);
            }


            // 3. Use the data
            console.log("Selected Checkboxes:", selectedSongID); 
                    
                }
            
            )   

            }

                catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            
            }
TransferSongs();