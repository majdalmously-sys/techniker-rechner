const counts = {};

const jobList = document.getElementById("jobList");
const totalPrice = document.getElementById("totalPrice");
const search = document.getElementById("search");
const today = document.getElementById("today");

today.textContent = new Date().toLocaleDateString("de-DE");

function render(filter = "") {

    jobList.innerHTML = "";

    jobs
        .filter(job =>
            job.name.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(job => {

            if (counts[job.id] === undefined)
                counts[job.id] = 0;

            const value = counts[job.id] * job.price;

            const div = document.createElement("div");

            div.className = "job";

            div.innerHTML = `
                <h3>${job.name}</h3>

                <div class="price">
                    ${job.price.toFixed(2)} €
                </div>

                <input
                    class="amount"
                    type="number"
                    min="0"
                    value="${counts[job.id]}"
                    onchange="changeValue(${job.id}, this.value)"
                >

                <div class="subtotal">
                    ${value.toFixed(2)} €
                </div>
            `;

            jobList.appendChild(div);

        });

    calculate();

}

function changeValue(id, value){

    counts[id] = parseInt(value) || 0;

    calculate();

    render(search.value);

}

function calculate(){

    let total = 0;

    jobs.forEach(job=>{

        total += counts[job.id] * job.price;

    });

    totalPrice.textContent =
        total.toFixed(2) + " €";

}

search.addEventListener("input", e=>{

    render(e.target.value);

});

render();document.getElementById("clearButton").addEventListener("click", () => {

    if(confirm("Möchten Sie wirklich alles löschen?")){

        jobs.forEach(job => {
            counts[job.id] = 0;
        });

        render(search.value);

    }

});document.getElementById("saveButton").addEventListener("click", saveDay);

function saveDay() {

    const today = new Date().toLocaleDateString("de-DE");

    let history = JSON.parse(localStorage.getItem("history")) || [];

    const entries = [];

    let total = 0;

    jobs.forEach(job => {

        const amount = counts[job.id] || 0;

        if(amount > 0){

            entries.push({
                id: job.id,
                name: job.name,
                amount: amount,
                price: job.price,
                total: amount * job.price
            });

            total += amount * job.price;

        }

    });

    if(entries.length === 0){

        alert("Keine Daten zum Speichern.");

        return;

    }

    history.push({

        date: today,

        entries: entries,

        total: total

    });

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    if(confirm("Tag gespeichert.\n\nNeuen Arbeitstag beginnen?")){

        jobs.forEach(job => counts[job.id] = 0);

        render();

    }

}