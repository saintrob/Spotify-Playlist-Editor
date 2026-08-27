async function selectSourceTracks() {
    try{
        const button = document.querySelector("#selectSourceTracks_button")
        const confirmButton = document.getElementById('selectSourceTracks_button');

        confirmButton.addEventListener('click', () => {
        // 1. Select all checkboxes with name="fruit" that are currently checked (:checked)
        const checkedBoxes = document.querySelectorAll('input[name="source_tracks"]:checked');
        
        // 2. Convert the NodeList into a standard array and map out just the values
        const selectedValues = Array.from(checkedBoxes).map(cb => cb.value);
        
        // 3. Use the data
        console.log("Selected Checkboxes:", selectedValues); 
                
            }
        )}
            catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }

selectSourceTracks();