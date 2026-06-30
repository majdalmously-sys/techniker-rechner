let counts = {};

const jobList = document.getElementById("jobList");
const totalPrice = document.getElementById("totalPrice");
const search = document.getElementById("search");

function render(filter = "") {
    jobList.innerHTML = "";

    jobs
        .filter(job => job.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(job => {

            if (counts[job.id] === undefined)
                counts[job.id] = 0;

            const div = document.createElement("div");
            div.className = "job";

            div.innerHTML = `
                <h3>${job.name}</h3>
                <div class="price">${job.price.toFixed(2)} €</div>

                <div class="controls">

                    <button onclick="minus(${job.id})">-</button>

                    <div class="count" id="count-${job.id}">
                        ${counts[job.id]}
                    </div>

                    <button onclick="plus(${job.id})">+</button>

                </div>
            `;

            jobList.appendChild(div);

        });

    calculate();
}

function plus(id){
    counts[id]++;
    document.getElementById("count-"+id).innerText = counts[id];
    calculate();
}

function minus(id){
    if(counts[id]>0){
        counts[id]--;
        document.getElementById("count-"+id).innerText = counts[id];
    }
    calculate();
}

function calculate(){

    let total = 0;

    jobs.forEach(job=>{
        total += counts[job.id] * job.price;
    });

    totalPrice.innerText = total.toFixed(2)+" €";

}

search.addEventListener("input",e=>{
    render(e.target.value);
});

document.getElementById("saveButton").addEventListener("click",()=>{

    alert("Diese Funktion kommt in Version 2 😉");

});

render();