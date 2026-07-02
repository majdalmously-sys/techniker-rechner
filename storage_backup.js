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

    const detailsModal = document.getElementById("detailsModal");
    const detailsContent = document.getElementById("detailsContent");
    const closeDetails = document.getElementById("closeDetails");

    let html = `
        <h3>${day.date}</h3>
        <hr>
    `;

    day.entries.forEach(job => {

        html += `
            <div class="detail-row">
                <span>${job.name}</span>
                <strong>x${job.qty}</strong>
            </div>
        `;

    });

    html += `
    <hr>

    <h2 class="day-total">
        Gesamt: ${day.total.toFixed(2)} €
    </h2>

    <button class="edit-day"
            onclick="editDay(${index})">

        ✏️ Bearbeiten

    </button>

    <button class="delete-day"
            onclick="deleteDay(${index})">

        🗑️ Tag löschen

    </button>
`;

<button class="delete-day"
        onclick="deleteDay(${index})">

    Tag löschen

</button>
    `;

    detailsContent.innerHTML = html;

    detailsModal.classList.remove("hidden");

    closeDetails.onclick = () => {

        detailsModal.classList.add("hidden");

    };

}
function editDay(index){

    alert("Bearbeiten kommt im nächsten Schritt.");

}
function deleteDay(index){

    if(!confirm("Diesen Tag wirklich löschen?")){
        return;
    }

    const history = getHistory();

    history.splice(index,1);

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    document
        .getElementById("detailsModal")
        .classList
        .add("hidden");

    renderHistory();

}
    function editDay(index){

    console.log("Edit:", index);

    alert("Bearbeiten wird jetzt gebaut 😉");

}