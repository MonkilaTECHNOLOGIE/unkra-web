const dataSelect = document.getElementById('dataSelect');
const fetchDataButton = document.getElementById('fetchData');
const editorIframe = document.getElementById('editorIframe');


function checkLoginStatus() {
    const token = localStorage.getItem('userToken'); 
    if (!token) {
        alert('Vous devez être connecté pour accéder à cette page.');
        window.location.href = 'login.html';
    }
}

checkLoginStatus();

fetchDataButton.addEventListener('click', async () => {
    const selectedValue = dataSelect.value;
    if (!selectedValue) {
        alert("Please select a collection");
        return;
    }

    const apiKey = 'avROr1S2KOP9G6BnMnIBBbPzBLxYVzoCdvNkNkJWVKZVzrgTW54uS83OP6wkXaul';
    const url = `https://data.mongodb-api.com/app/data-pcwkb/endpoint/data/v1/action/find`;
    const payload = JSON.stringify({
        collection: selectedValue.toLowerCase(),
        database: "db-monkila",
        dataSource: "db-monkila",
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': apiKey,
        },
        body: payload,
    });

    if (!response.ok) {
        alert("Failed to fetch data. Please try again.");
        return;
    }

    const data = await response.json();
    editorIframe.contentWindow.postMessage(data, '*');
});
