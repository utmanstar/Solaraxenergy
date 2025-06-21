// script.js

document.addEventListener("DOMContentLoaded", function () { const addItemBtn = document.getElementById("addItem"); const itemNameInput = document.getElementById("itemName"); const itemPriceInput = document.getElementById("itemPrice"); const priceItemsList = document.getElementById("priceItems"); const dateInput = document.getElementById("date"); const downloadBtn = document.getElementById("download"); const clearAllBtn = document.getElementById("clearAll");

function formatDate(dateStr) { const [year, month, day] = dateStr.split("-"); return ${day}-${month}-${year}; }

function updateDate() { const dateText = document.getElementById("poster-date-text"); const dateVal = dateInput.value; if (dateVal) { dateText.textContent = formatDate(dateVal); localStorage.setItem("solarax-date", dateVal); } }

function saveItemsToStorage() { const items = []; priceItemsList.querySelectorAll("li").forEach(li => { const spans = li.querySelectorAll("span"); if (spans.length === 2) { items.push({ name: spans[0].textContent, price: spans[1].textContent }); } }); localStorage.setItem("solarax-items", JSON.stringify(items)); }

function loadItemsFromStorage() { const items = JSON.parse(localStorage.getItem("solarax-items")) || []; items.forEach(item => addItem(item.name, item.price));

const savedDate = localStorage.getItem("solarax-date");
if (savedDate) {
  dateInput.value = savedDate;
  updateDate();
}

}

function addItem(name, price) { const li = document.createElement("li"); const nameSpan = document.createElement("span"); nameSpan.textContent = name; const priceSpan = document.createElement("span"); priceSpan.textContent = price; const removeBtn = document.createElement("button"); removeBtn.textContent = "✕"; removeBtn.classList.add("remove-btn"); removeBtn.addEventListener("click", () => { li.remove(); saveItemsToStorage(); });

li.appendChild(nameSpan);
li.appendChild(priceSpan);
li.appendChild(removeBtn);
priceItemsList.appendChild(li);

}

addItemBtn.addEventListener("click", () => { const itemName = itemNameInput.value.trim(); const itemPrice = itemPriceInput.value.trim();

if (!itemName || !itemPrice) return;

addItem(itemName, itemPrice);
saveItemsToStorage();

itemNameInput.value = "";
itemPriceInput.value = "";

});

clearAllBtn.addEventListener("click", () => { priceItemsList.innerHTML = ""; localStorage.removeItem("solarax-items"); });

dateInput.addEventListener("change", updateDate);

downloadBtn.addEventListener("click", () => { const poster = document.getElementById("poster");

// Hide remove buttons
const removeBtns = document.querySelectorAll(".remove-btn");
removeBtns.forEach(btn => btn.style.display = "none");

updateDate();

html2canvas(poster, {
  useCORS: true,
  scale: 2
}).then((canvas) => {
  const link = document.createElement("a");
  link.download = `Solarax_Price_List_${new Date().toLocaleDateString()}.png`;
  link.href = canvas.toDataURL();
  link.click();

  // Restore remove buttons
  removeBtns.forEach(btn => btn.style.display = "block");
});

});

loadItemsFromStorage(); });

