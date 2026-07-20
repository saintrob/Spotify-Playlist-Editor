async function fetchData() {
    try  {
        const response = await fetch('http://127.0.0.1:5500/ping')
        const data = await response.json();
    }
    catch(error) {
        console.error("Error fetching data poopie: ", error)
    }
}