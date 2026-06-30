function getHistory() {
    return JSON.parse(localStorage.getItem("history")) || [];
}

function saveCurrentDay() {

    let history = getHistory();

    let entries = [];
    let total = 0;

    jobs.forEach(job => {

        const qty = counts[job.id] || 0;

        if (qty > 0) {

            entries.push({
                id: job.id,
                name: job.name,
                qty: qty,
                price: job.price,
                total: qty * job.price
            });

            total += qty * job.price;

        }

    });

    if (entries.length === 0) {
        alert("Keine Daten zum Speichern.");
        return;
    }

    const today = new Date().toLocaleDateString("de-DE");

    const dayData = {
        date: today,
        entries: entries,
        total: total
    };

    const index = history.findIndex(day => day.date === today);

    if (index >= 0) {

        if (confirm("Für dieses Datum gibt es bereits einen Eintrag.\nMöchtest du ihn ersetzen?")) {
            history[index] = dayData;
        } else {
            return;
        }

    } else {

        history.push(dayData);

    }

    localStorage.setItem("history", JSON.stringify(history));

    alert("Tag erfolgreich gespeichert.");
}

function renderHistory() {

    const historyList = document.getElementById("historyList");

    historyList.innerHTML = "";

    const history = getHistory();

    if (history.length === 0) {
        historyList.innerHTML = "<p>Keine gespeicherten Tage.</p>";
        return;
    }

    let monthTotal = 0;

    history.forEach((day, index) => {

        monthTotal += day.total;

        historyList.innerHTML += `
            <div class="history-item">
                <strong>${day.date}</strong><br>
                Gesamt: ${day.total.toFixed(2)} €
                <br><br>
                <button onclick="showDay(${index})">
                    Anzeigen
                </button>
            </div>
        `;

    });

    historyList.innerHTML += `
        <hr>
        <h3>Monatsgesamt: ${monthTotal.toFixed(2)} €</h3>
    `;
}

function showDay(index) {

    const history = getHistory();

    const day = history[index];

    let text = day.date + "\n\n";

    day.entries.forEach(job => {
        text += `${job.name} x${job.qty}\n`;
    });

    text += "\n-----------------\n";
    text += `Gesamt: ${day.total.toFixed(2)} €`;

    alert(text);
}