function getHistory() {
    return JSON.parse(localStorage.getItem("history")) || [];
}

function saveHistory(history) {
    localStorage.setItem("history", JSON.stringify(history));
}

function saveCurrentDay() {

    const history = getHistory();

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

  const selectedDate = document.getElementById("workDate").value;

const dayData = {
    date: editingIndex !== null
        ? history[editingIndex].date
        : selectedDate,

    entries: entries,
    total: total
};

   if (editingIndex !== null) {

    history[editingIndex] = dayData;

    editingIndex = null;

} else {

const selectedDate = document.getElementById("workDate").value;

const index = history.findIndex(day => day.date === selectedDate);
    if (index >= 0) {

        if (!confirm("Für dieses Datum existiert bereits ein Eintrag.\nErsetzen?")) {
            return;
        }

        history[index] = dayData;

    } else {

        history.push(dayData);

    }

}

    saveHistory(history);

    alert("Tag erfolgreich gespeichert.");

}

function renderHistory() {

    const historyList = document.getElementById("historyList");

    historyList.innerHTML = "";

    const history = getHistory();

    if (history.length === 0) {

        historyList.innerHTML =
            "<p>Keine gespeicherten Tage.</p>";

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
        <h3>
            Monatsgesamt:
            ${monthTotal.toFixed(2)} €
        </h3>
    `;

}

function showDay(index) {

    const history = getHistory();
    const day = history[index];

    const detailsModal =
        document.getElementById("detailsModal");

    const detailsContent =
        document.getElementById("detailsContent");

    const closeDetails =
        document.getElementById("closeDetails");

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

    detailsContent.innerHTML = html;

    detailsModal.classList.remove("hidden");

    closeDetails.onclick = () => {

        detailsModal.classList.add("hidden");

    };

}


function editDay(index){

    const history = getHistory();

    editingIndex = index;

    loadDayForEdit(history[index]);

    document
        .getElementById("detailsModal")
        .classList
        .add("hidden");

}

document.getElementById("backupButton").addEventListener("click", () => {

    const history = getHistory();

    const backup = {
        version: "3.0",
        created: new Date().toISOString(),
        history: history
    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `techniker-backup-${new Date().toISOString().slice(0,10)}.json`;

    link.click();

    URL.revokeObjectURL(link.href);

});

const restoreInput = document.getElementById("restoreFile");

document.getElementById("restoreButton").addEventListener("click", () => {
    restoreInput.click();
});

restoreInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const backup = JSON.parse(e.target.result);

            if (!backup.history || !Array.isArray(backup.history)) {
                alert("❌ Ungültige Sicherungsdatei.");
                return;
            }

            if (!confirm("Alle aktuellen Daten werden ersetzt.\nFortfahren?")) {
                return;
            }

saveHistory(backup.history);

            alert("✅ Sicherung erfolgreich wiederhergestellt.");

            location.reload();

        } catch (err) {

            alert("❌ Fehler beim Lesen der Sicherungsdatei.");

        }

    };

    reader.readAsText(file);

    restoreInput.value = "";

});

function deleteDay(index){

    const history = getHistory();

    if(!confirm("Diesen Tag wirklich löschen?")){
        return;
    }

    history.splice(index,1);

    saveHistory(history);

    document
        .getElementById("detailsModal")
        .classList
        .add("hidden");

    renderHistory();

}