const apiUrl = "http://gamf.nhely.hu/ajax2/";
const userCode = "C3Z0TYandJC84WPrandom";

// Adatok betöltése a táblázatba
async function readData(id = null) {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `code=${userCode}&op=read`
    });

    const data = await response.json();

    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    data.list.forEach(record => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.name}</td>
            <td>${record.height}</td>
            <td>${record.weight}</td>
            <td>${record.code}</td>
        `;
        tableBody.appendChild(row);
    });

    // Ha egy ID-re vagyunk kíváncsiak (pl. lekérdezés egy adott elemre)
    if (id) {
        const record = data.list.find(item => item.id == id);
        const output = document.querySelector("#output");

        if (record) {
            document.querySelector("#id").value = record.id;
            document.querySelector("#name").value = record.name;
            document.querySelector("#height").value = record.height;
            document.querySelector("#weight").value = record.weight;

            output.innerHTML = `
                <p><strong>ID:</strong> ${record.id}</p>
                <p><strong>Név:</strong> ${record.name}</p>
                <p><strong>Magasság:</strong> ${record.height}</p>
                <p><strong>Súly:</strong> ${record.weight}</p>
                <p><strong>Kód:</strong> ${record.code}</p>
            `;
        } else {
            output.innerHTML = "<p>Nincs találat az adott ID-re.</p>";
        }
    }

    // Magasság statisztika
    const heights = data.list.map(r => parseFloat(r.height)).filter(h => !isNaN(h));
    if (heights.length > 0) {
        const sum = heights.reduce((a, b) => a + b, 0);
        const avg = (sum / heights.length).toFixed(2);
        const max = Math.max(...heights);

        const stats = document.querySelector("#stats");
        stats.innerHTML = `
            <p><strong>Magasságok összeg:</strong> ${sum}</p>
            <p><strong>Átlag:</strong> ${avg}</p>
            <p><strong>Legnagyobb:</strong> ${max}</p>
        `;
    }
}

// Submit gomb eseménykezelő
document.querySelector("#dataForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const operation = document.querySelector("input[name='operation']:checked").value;
    const id = document.querySelector("#id").value.trim();
    const name = document.querySelector("#name").value.trim();
    const height = document.querySelector("#height").value.trim();
    const weight = document.querySelector("#weight").value.trim();
    const feedback = document.querySelector("#feedback");

    let body = `code=${userCode}&op=${operation}`;

    if (operation === "create" || operation === "update") {
        if (!name || !height || !weight || name.length > 30) {
            alert("A mezők nem lehetnek üresek, és a név maximum 30 karakter lehet!");
            return;
        }
        if (operation === "update" && !id) {
            alert("Frissítéshez ID szükséges!");
            return;
        }

        body += `&name=${name}&height=${height}&weight=${weight}`;
        if (operation === "update") body += `&id=${id}`;
    } else if (operation === "delete") {
        if (!id) {
            alert("Törléshez ID szükséges!");
            return;
        }
        body += `&id=${id}`;
    }

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
    });

    const result = await response.text();
    console.log(result);

    feedback.textContent = `${operation} sikeres!`;
    readData(); // Frissítés után újra betöltjük az adatokat
});

// Lekérdezés gomb külön kezelése
document.querySelector("#queryButton").addEventListener("click", (e) => {
    e.preventDefault();
    const id = document.querySelector("#id").value.trim();
    readData(id || null);
});

// Művelet kiválasztása – mezők aktiválása/deaktiválása
document.querySelectorAll("input[name='operation']").forEach(radio => {
    radio.addEventListener("change", () => {
        const op = document.querySelector("input[name='operation']:checked").value;
        document.querySelector("#id").disabled = !(op === "update" || op === "delete");
        document.querySelector("#name").disabled = !(op === "create" || op === "update");
        document.querySelector("#height").disabled = !(op === "create" || op === "update");
        document.querySelector("#weight").disabled = !(op === "create" || op === "update");

        document.querySelector("#output").innerHTML = "";
        document.querySelector("#stats").innerHTML = "";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    readData();
});