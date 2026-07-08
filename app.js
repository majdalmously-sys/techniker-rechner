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

// ===== app.js (قسم الأحداث والتشغيل الموحد) =====

// 1. تفعيل فتح وإغلاق قائمة الثلاث نقاط
const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

if (menuButton && menu) {
    menuButton.onclick = (e) => {
        e.stopPropagation(); // منع إغلاق القائمة فوراً عند الضغط على الزر نفسه
        menu.classList.toggle("hidden");
    };

    // إغلاق القائمة عند الضغط في أي مكان خارجها
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== menuButton) {
            menu.classList.add("hidden");
        }
    });
}

// 2. ربط أزرار القائمة (الثلاث نقاط) بالوظائف الصحيحة
document.getElementById("backupBtn").addEventListener("click", () => {
    const history = getHistory();
    const backup = {
        version: "3.0",
        created: new Date().toISOString(),
        history: history
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `techniker-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
});

const restoreInput = document.getElementById("restoreFile");
document.getElementById("restoreBtn").addEventListener("click", () => {
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

// زر السجل (Verlauf) من القائمة العلوية
document.getElementById("historyBtn").addEventListener("click", () => {
    renderHistory();
    document.getElementById("historyModal").classList.remove("hidden");
    menu.classList.add("hidden"); // إغلاق القائمة بعد الفتح
});

// زر حذف الكل (Alles löschen) من القائمة العلوية
document.getElementById("clearBtn").addEventListener("click", () => {
    if (!confirm("Möchtest du wirklich alles löschen?")) return;
    jobs.forEach(job => {
        counts[job.id] = 0;
    });
    calculate();
    render(search.value);
    menu.classList.add("hidden");
});


// 3. ربط أزرار الأسفل (Footer)
document.getElementById("saveButton").addEventListener("click", () => {
    saveCurrentDay();
});

document.getElementById("historyButton").addEventListener("click", () => {
    renderHistory();
    document.getElementById("historyModal").classList.remove("hidden");
});

document.getElementById("clearButton").addEventListener("click", () => {
    if (!confirm("Möchtest du wirklich alles löschen?")) return;
    jobs.forEach(job => {
        counts[job.id] = 0;
    });
    calculate();
    render(search.value);
});


// 4. تفعيل الـ Service Worker للعمل بدون إنترنت (Offline Mode) بشكل رسمي
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
            .then(reg => console.log("Service Worker successfully registered!", reg.scope))
            .catch(err => console.error("Service Worker registration failed:", err));
    });
}

// ===== كود استقبال ومزامنة البيانات تلقائياً من نظام Kasys =====
function checkIncomingDataFromKasys() {
    const urlParams = new URLSearchParams(window.location.search);
    const incomingData = urlParams.get('data');

    if (incomingData) {
        try {
            // فك تشفير البيانات القادمة وتحويلها لمصفوفة خدمات
            const detectedServices = JSON.parse(decodeURIComponent(incomingData));
            
            if (Array.isArray(detectedServices) && detectedServices.length > 0) {
                // مسح الاختيارات القديمة لكي لا تختلط البيانات
                clearAllInputs(); 

                let matchedCount = 0;

                // مطابقة النصوص القادمة مع الخدمات الموجودة في ملف data.js الخاص بك
                detectedServices.forEach(serviceText => {
                    // البحث عن الخدمة في تطبيقك التي يتطابق اسمها مع نص Kasys
                    const matchedJob = jobs.find(job => 
                        serviceText.toLowerCase().includes(job.name.toLowerCase()) || 
                        job.name.toLowerCase().includes(serviceText.toLowerCase())
                    );

                    if (matchedJob) {
                        // إذا وجدنا الخدمة، نضع الكمية 1 تلقائياً ونفعلها
                        const quantityInput = document.getElementById(`qty-${matchedJob.id}`);
                        if (quantityInput) {
                            quantityInput.value = 1;
                            // استدعاء دالة التحديث المعتمدة في تطبيقك لحساب المجموع فوراً
                            if (typeof updateTotals === 'function') { updateTotals(); }
                            if (typeof saveState === 'function') { saveState(); }
                            matchedCount++;
                        }
                    }
                });

                if (matchedCount > 0) {
                    alert(`🎉 ممتاز! تم استيراد ونقل (${matchedCount}) خدمات من نظام Kasys إلى تطبيقك بنجاح!`);
                } else {
                    alert("⚠️ تم استقبال بيانات، ولكن لم تتطابق أسماء الخدمات مع الخدمات المخزنة في تطبيقك.");
                }
                
                // تنظيف الرابط العلوي للمتصفح لكي لا تتكرر المزامنة عند تحديث الصفحة
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (e) {
            console.error("خطأ في قراءة بيانات المزامنة:", e);
        }
    }
}

// تشغيل الفحص تلقائياً بمجرد فتح التطبيق
document.addEventListener("DOMContentLoaded", () => {
    // ننتظر قليلاً للتأكد من تحميل القائمة الأساسية أولاً
    setTimeout(checkIncomingDataFromKasys, 500);
});