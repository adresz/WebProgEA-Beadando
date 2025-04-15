// Adatok lekérése a localStorage-ból
function getData() {
    return JSON.parse(localStorage.getItem('tableData')) || [];
}

// Adatok mentése a localStorage-ba
function setData(data) {
    localStorage.setItem('tableData', JSON.stringify(data));
}

// Táblázat újrarenderelése
function renderTable() {
    const data = getData();
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    data.forEach((row, index) => {
        tbody.innerHTML += `
            <tr>
                <td contenteditable onblur="validateAndUpdate(${index}, 'name', this.innerText)">${row.name}</td>
                <td contenteditable onblur="validateAndUpdate(${index}, 'city', this.innerText)">${row.city}</td>
                <td contenteditable onblur="updateCell(${index}, 'age', this.innerText)">${row.age}</td>
                <td contenteditable onblur="updateCell(${index}, 'email', this.innerText)">${row.email}</td>
                <td><button onclick="deleteRow(${index})" class="DeleteButton">Töröl</button></td>
            </tr>`;
    });
}

// Új sor hozzáadása
function addRow() {
    const name = document.getElementById('name').value.trim();
    const city = document.getElementById('city').value.trim();
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value.trim();

    if (!name || !city || !age || !email) {
        alert('Minden mezőt ki kell tölteni!');
        return;
    }

    if (name.length < 4) {
        alert('A névnek legalább 4 karakter hosszúnak kell lennie!');
        return;
    }

    if (city.length > 42) {
        alert('A város maximum 42 karakter hosszú lehet!');
        return;
    }

    const newRow = { name, city, age, email };
    const data = getData();
    data.push(newRow);
    setData(data);
    renderTable();
    clearForm();
}

// Cellák validálása és frissítése
function validateAndUpdate(index, key, value) {
    value = value.trim();

    if (key === 'name' && value.length < 4) {
        alert('A névnek legalább 4 karakter hosszúnak kell lennie!');
        renderTable();
        return;
    }

    if (key === 'city' && value.length > 42) {
        alert('A város maximum 42 karakter hosszú lehet!');
        renderTable();
        return;
    }

    updateCell(index, key, value);
}

// Cellák frissítése adatban
function updateCell(index, key, value) {
    const data = getData();
    data[index][key] = value;
    setData(data);
}

// Sor törlése
function deleteRow(index) {
    const data = getData();
    data.splice(index, 1);
    setData(data);
    renderTable();
}

// Űrlap mezők törlése
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('city').value = '';
    document.getElementById('age').value = '';
    document.getElementById('email').value = '';
}

// Táblázat rendezése adott oszlop szerint
function sortTable(colIndex) {
    const data = getData();
    const keys = ['name', 'city', 'age', 'email'];

    data.sort((a, b) => {
        const valA = a[keys[colIndex]].toString().toLowerCase();
        const valB = b[keys[colIndex]].toString().toLowerCase();
        return valA.localeCompare(valB);
    });

    setData(data);
    renderTable();
}

// Táblázat szűrése keresés alapján
function searchTable() {
    const filter = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('#dataTable tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Betöltéskor megjeleníti az adatokat
window.onload = renderTable;
