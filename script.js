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

/* ChartJS */
    
let chart;
function drawChart(row) {
    const cells = row.getElementsByTagName("td");
    const label = cells[0].innerText;
    const data = [];

    // Címkék: A, B, C, ... az adatok számától függően
    const labels = [];

    for (let i = 1; i < cells.length; i++) {
        data.push(parseFloat(cells[i].innerText));
        labels.push(String.fromCharCode(64 + i)); // 65=A, 66=B, stb.
    }

    const ctx = document.getElementById('lineChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label + ' adatai',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
/*  HTML5 */
function saveData() {
    let inputValue = document.getElementById("WebStorageInput").value;
    localStorage.setItem("savedText", inputValue);
    alert("Elmentve!");
    document.getElementById("WebStorageInput").value = "";
  }

  function loadData() {
    let storedValue = localStorage.getItem("savedText");
    if (storedValue !== null) {
      document.getElementById("WebStorageInput").value = storedValue;
      alert("Vissza töltve, az input mezőbe!");
    } else {
      alert("Nincs elmentett adat.");
    }
  }

  function clearData() {
    localStorage.removeItem("savedText");
    document.getElementById("WebStorageInput").value = "";
    alert("Törölve!");
  }

let worker;
      
function startWorker() 
{
    if (typeof(Worker) !== "undefined") 
    {
        if (!worker) 
        {
            worker = new Worker("worker.js");
            worker.onmessage = function(event) 
            {
                document.getElementById("result").textContent = event.data;
            };
        }
    } 
else 
    {
    alert("A böngésző nem támogatja a Web Workereket.");
    }
}

function stopWorker()
{
    if (worker) 
    {
        worker.terminate();
        worker = null;
    }
}

const colorBox = document.getElementById("colorBox");
const colorPicker = document.getElementById("colorPicker");

// Szín mentése a localStorage-be
function saveColor() {
  const color = colorPicker.value;
  localStorage.setItem("selectedColor", color);
  updateColorBox(color);
}

// Szín alkalmazása a dobozra
function updateColorBox(color) {
  colorBox.style.backgroundColor = color;
}

// Alapértelmezett szín betöltése oldal betöltéskor
window.onload = () => {
  renderTable();
  const savedColor = localStorage.getItem("selectedColor");
  if (savedColor) {
    updateColorBox(savedColor);
    colorPicker.value = savedColor;
  }
};

// Másik ablak/fül változásaira reagálás
window.addEventListener("storage", (event) => {
  if (event.key === "selectedColor") {
    updateColorBox(event.newValue);
  }
});

// 
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("location").innerHTML = "A geolokációs funkció nem támogatott ezen a böngészőn.";
    }
}

function showPosition(position) {
    document.getElementById("location").innerHTML = "Szélesség: " + position.coords.latitude + "<br>Hosszúság: " + position.coords.longitude;
}

// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 200, 100);


const dragItem = document.getElementById("dragme");
const dropZone = document.getElementById("dropzone");

dragItem.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", dragItem.id);
});

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("hovered");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("hovered");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);

    if (draggedElement && dropZone !== draggedElement.parentElement) {
        dropZone.innerText = ""; // törli a "Dobd ide" szöveget
        draggedElement.setAttribute("draggable", "false"); // ne lehessen újra húzni
        draggedElement.style.cursor = "default";
        dropZone.appendChild(draggedElement);
    }

    dropZone.classList.remove("hovered");
});