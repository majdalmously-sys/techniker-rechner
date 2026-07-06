// ===== Techniker Rechner Pro =====

const jobList = document.getElementById("jobList");
const totalPrice = document.getElementById("totalPrice");
const search = document.getElementById("search");
const today = document.getElementById("today");

const counts = {};
console.log("APP VERSION 2026-07-04");
let editingIndex = null;
today.textContent = new Date().toLocaleDateString("de-DE");
const workDate = document.getElementById("workDate");

workDate.value = new Date().toISOString().split("T")[0];

function render(filter = "") {

    jobList.innerHTML = "";

    jobs
        .filter(job =>
            job.name.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(job => {

            if (counts[job.id] == null)
                counts[job.id] = 0;

            const subtotal =
                counts[job.id] * job.price;

            const card = document.createElement("div");

            card.className = "job";

            card.innerHTML = `

                <h3>${job.name}</h3>

                <div class="price">
                    ${job.price.toFixed(2)} €
                </div>

                <input
                    class="amount"
                    type="number"
                    min="0"
                    value="${counts[job.id]}"
                    onchange="changeAmount(${job.id},this.value)"
                >

                <div class="subtotal">

                    ${subtotal.toFixed(2)} €

                </div>

            `;

            jobList.appendChild(card);

        });

    calculate();

}

function changeAmount(id,value){

    counts[id]=parseInt(value)||0;

    calculate();

    render(search.value);

}

function calculate(){

    let total=0;

    jobs.forEach(job=>{

        total+=counts[job.id]*job.price;

    });

    totalPrice.textContent=
        total.toFixed(2)+" €";

}

search.addEventListener("input",e=>{

    render(e.target.value);

});
document.getElementById("saveButton").addEventListener("click", () => {

    saveCurrentDay();

});
const historyButton =
document.getElementById("historyButton");

const historyModal =
document.getElementById("historyModal");

const closeHistory =
document.getElementById("closeHistory");

historyButton.addEventListener("click",()=>{

    

    renderHistory();

    historyModal.classList.remove("hidden");

});

 

closeHistory.addEventListener("click",()=>{

    historyModal.classList.add("hidden");

});
document.getElementById("clearButton").addEventListener("click", () => {

    if (!confirm("Möchtest du wirklich alles löschen?")) return;

    jobs.forEach(job => {
        counts[job.id] = 0;
    });

    calculate();
    render(search.value);

});
render();
function loadDayForEdit(day){

    jobs.forEach(job=>{
        counts[job.id]=0;
    });

    day.entries.forEach(entry=>{
        counts[entry.id]=entry.qty;
    });

    render(search.value);
    calculate();

}
/*
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("service-worker.js");

    });

}
*/

window.addEventListener("load", () => {

    setTimeout(() => {

        document.getElementById("splash").classList.add("hiddenSplash");

    }, 2000);

});

const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

if (menuButton && menu) {
    menuButton.onclick = () => {
        menu.classList.toggle("hidden");
    };

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== menuButton) {
            menu.classList.add("hidden");
        }
    });
}
