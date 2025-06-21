// script.js

document.addEventListener("DOMContentLoaded", function () { const addItemBtn = document.getElementById("addItem"); const itemNameInput = document.getElementById("itemName"); const itemPriceInput = document.getElementById("itemPrice"); const priceItemsList = document.getElementById("priceItems"); const dateInput = document.getElementById("date"); const downloadBtn = document.getElementById("download"); const clearAllBtn = document.getElementById("clearAll"); const dateText = document.getElementById("poster-date-text");

function formatDate(dateStr) { if (!dateStr) return "dd-mm-yyyy"; const [year, month, day] = dateStr.split("-"); return ${day}-${month}-${year}; }

function updateDate() { const val = dateInput.value; dateText.textContent = formatDate(val); localStorage.setItem("solarax-date", val); }

function saveItems() { const items = []; document.querySelectorAll("#priceItems li").forEach(li => { const name = li.querySelector("span:nth-child(1)").textContent; const price = li.querySelector("span:nth-child(2)").textContent; items.push({ name, price }); }); localStorage.setItem("solarax-items", JSON.stringify(items)); }

function loadItems() { const items = JSON.parse(localStorage.getItem("solarax-items") || "[]"); items.forEach(({ name, price }) => addItem(name, price)); }

function loadDate() { const savedDate = localStorage.getItem("solarax-date"); if (savedDate) { dateInput.value = savedDate; updateDate(); } }

function addItem(name, price) { const li = document.createElement("li");

const nameSpan = document.createElement("span");
nameSpan.textContent = name;

const priceSpan = document.createElement("span");
priceSpan.textContent = price;

const upBtn = document.createElement("button");
upBtn.textContent = "🔼";
upBtn.classList.add("up-btn");
upBtn.addEventListener("click", () => {
  const prev = li.previousElementSibling;
  if (prev) {
    priceItemsList.insertBefore(li, prev);
    saveItems();
  }
});

const downBtn = document.createElement("button");
downBtn.textContent = "🔽";
downBtn.classList.add("down-btn");
downBtn.addEventListener("click", () => {
  const next = li.nextElementSibling;
  if (next) {
    priceItemsList.insertBefore(next, li);
    saveItems();
  }
});

const removeBtn = document.createElement("button");
removeBtn.textContent = "✕";
removeBtn.classList.add("remove-btn");
removeBtn.addEventListener("click", () => {
  li.remove();
  saveItems();
});

li.appendChild(nameSpan);
li.appendChild(priceSpan);
li.appendChild(upBtn);
li.appendChild(downBtn);
li.appendChild(removeBtn);
priceItemsList.appendChild(li);

}

addItemBtn.addEventListener("click", () => { const itemName = itemNameInput.value.trim(); const itemPrice = itemPriceInput.value.trim();

if (!itemName || !itemPrice) return;

addItem(itemName, itemPrice);
itemNameInput.value = "";
itemPriceInput.value = "";
saveItems();

});

clearAllBtn.addEventListener("click", () => { if (confirm("Clear all items?")) { priceItemsList.innerHTML = ""; localStorage.removeItem("solarax-items"); } });

dateInput.addEventListener("change", updateDate);

downloadBtn.addEventListener("click", () => { const poster = document.getElementById("poster"); const tempBtns = poster.querySelectorAll(".remove-btn, .up-btn, .down-btn"); tempBtns.forEach(btn => btn.style.display = "none");

updateDate();

html2canvas(poster, { useCORS: true, scale: 2 }).then(canvas => {
  const link = document.createElement("a");
  link.download = `Solarax_Price_List_${dateText.textContent}.png`;
  link.href = canvas.toDataURL();
  link.click();
  tempBtns.forEach(btn => btn.style.display = "inline-block");
});

});

loadItems(); loadDate(); });

