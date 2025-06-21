document.addEventListener("DOMContentLoaded", function () { const addItemBtn = document.getElementById("addItem"); const itemNameInput = document.getElementById("itemName"); const itemPriceInput = document.getElementById("itemPrice"); const priceItemsList = document.getElementById("priceItems"); const dateInput = document.getElementById("date"); const dateText = document.getElementById("poster-date-text"); const downloadBtn = document.getElementById("download"); const clearAllBtn = document.getElementById("clearAll");

// Format date to dd-mm-yyyy function formatDate(dateStr) { if (!dateStr) return "--/--/----"; const [year, month, day] = dateStr.split("-"); return ${day}-${month}-${year}; }

function updateDate() { const formatted = formatDate(dateInput.value); dateText.textContent = formatted; localStorage.setItem("posterDate", dateInput.value); }

function createListItem(name, price) { const li = document.createElement("li");

const nameSpan = document.createElement("span");
nameSpan.textContent = name;

const priceSpan = document.createElement("span");
priceSpan.textContent = price;

const removeBtn = document.createElement("button");
removeBtn.textContent = "✕";
removeBtn.classList.add("remove-btn");
removeBtn.addEventListener("click", () => {
  li.remove();
  saveItems();
});

li.appendChild(nameSpan);
li.appendChild(priceSpan);
li.appendChild(removeBtn);

priceItemsList.appendChild(li);

}

function saveItems() { const items = []; document.querySelectorAll("#priceItems li").forEach(li => { const [name, price] = li.querySelectorAll("span"); items.push({ name: name.textContent, price: price.textContent }); }); localStorage.setItem("priceItems", JSON.stringify(items)); }

function loadItems() { const savedItems = JSON.parse(localStorage.getItem("priceItems") || "[]"); savedItems.forEach(item => createListItem(item.name, item.price));

const savedDate = localStorage.getItem("posterDate");
if (savedDate) {
  dateInput.value = savedDate;
  updateDate();
}

}

addItemBtn.addEventListener("click", () => { const name = itemNameInput.value.trim(); const price = itemPriceInput.value.trim(); if (!name || !price) return; createListItem(name, price); itemNameInput.value = ""; itemPriceInput.value = ""; saveItems(); });

clearAllBtn.addEventListener("click", () => { priceItemsList.innerHTML = ""; localStorage.removeItem("priceItems"); });

dateInput.addEventListener("change", updateDate);

downloadBtn.addEventListener("click", () => { updateDate(); html2canvas(document.getElementById("poster"), { useCORS: true, scale: 2 }).then(canvas => { const link = document.createElement("a"); const date = formatDate(dateInput.value); link.download = Solarax_Price_List_${date}.png; link.href = canvas.toDataURL("image/png"); link.click(); }); });

loadItems(); });

