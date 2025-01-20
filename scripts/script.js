const dataSelect = document.getElementById('dataSelect');
const fetchDataButton = document.getElementById('fetchData');
const editorIframe = document.getElementById('editorIframe');



function showModal(message, redirectUrl) {
    document.getElementById('modal-message').innerText = message;
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';

    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 2000);
}


function checkLoginStatus() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        showModal('Vous devez être connecté pour accéder à cette page...', 'login.html')
    }
}

checkLoginStatus();

editorIframe.addEventListener('load', () => {
    editorIframe.classList.add('loaded');
});


fetchDataButton.addEventListener('click', async () => {
    const selectedValue = dataSelect.value;
    if (!selectedValue) {
        alert("Please select a collection");
        return;
    }

    const apiKey = 'avROr1S2KOP9G6BnMnIBBbPzBLxYVzoCdvNkNkJWVKZVzrgTW54uS83OP6wkXaul';
    const url = 'https://data.mongodb-api.com/app/data-pcwkb/endpoint/data/v1/action/find';
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    const payload = JSON.stringify({
        collection: selectedValue.toLowerCase(),
        database: "db-monkila",
        dataSource: "db-monkila",
    });

    const response = await fetch(`${proxy}${url}`, {
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
