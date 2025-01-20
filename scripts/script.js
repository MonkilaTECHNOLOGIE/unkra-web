const API_KEY = 'avROr1S2KOP9G6BnMnIBBbPzBLxYVzoCdvNkNkJWVKZVzrgTW54uS83OP6wkXaul';
const BASE_URL = 'https://data.mongodb-api.com/app/data-pcwkb/endpoint/data/v1/action';
const DATABASE = 'db-monkila';
const DATA_SOURCE = 'db-monkila';

document.getElementById('fetchDataBtn').addEventListener('click', fetchData);

function fetchData() {
    const choice = document.getElementById('dataChoice').value;
    const url = `${BASE_URL}/find`;
    const payload = {
        collection: choice,
        database: DATABASE,
        dataSource: DATA_SOURCE
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        populateTable(data.documents, choice);
    })
    .catch(error => console.error('Erreur lors de la récupération des données:', error));
}

function populateTable(data, collection) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = ''; // Clear existing rows
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item._id}</td>
            <td>${JSON.stringify(item)}</td>
            <td>
                <button onclick="editEntry('${item._id}', '${collection}')">Modifier</button>
                <button onclick="deleteEntry('${item._id}', '${collection}')">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteEntry(id, collection) {
    const url = `${BASE_URL}/deleteOne`;
    const payload = {
        collection: collection,
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { _id: id }
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert('Entrée supprimée avec succès');
        fetchData(); // Refresh data
    })
    .catch(error => console.error('Erreur lors de la suppression:', error));
}

function editEntry(id, collection) {
    const newData = prompt('Entrez les nouvelles données en JSON:', '{}');
    if (!newData) return;

    try {
        const parsedData = JSON.parse(newData);
        const url = `${BASE_URL}/updateOne`;
        const payload = {
            collection: collection,
            database: DATABASE,
            dataSource: DATA_SOURCE,
            filter: { _id: id },
            update: { $set: parsedData }
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            alert('Entrée modifiée avec succès');
            fetchData(); // Refresh data
        })
        .catch(error => console.error('Erreur lors de la modification:', error));
    } catch (err) {
        alert('Format JSON invalide');
    }
}
