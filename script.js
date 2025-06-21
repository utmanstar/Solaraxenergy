// script.js

document.addEventListener("DOMContentLoaded", function () { const addItemBtn = document.getElementById("addItem"); const itemNameInput = document.getElementById("itemName"); const itemPriceInput = document.getElementById("itemPrice"); const priceItemsList = document.getElementById("priceItems"); const dateInput = document.getElementById("date"); const downloadBtn = document.getElementById("download"); const clearAllBtn = document.getElementById("clearAll");

function formatDate(dateStr) { const [year, month, day] = dateStr.split("-"); return ${day}-${month}-${year}; }

function updateDate() { const dateText = document.getElementById("poster-date-text"); const dateVal = dateInput.value; if (dateVal) { dateText.textContent = formatDate(dateVal); } }

dateInput.addEventListener("change", updateDate);

addItemBtn.addEventListener("click", () => { const itemName = itemNameInput.value.trim(); const itemPrice = itemPriceInput.value.trim();

if (!itemName || !itemPrice) return;

const li = document.createElement("li");
const nameSpan = document.createElement("span");
nameSpan.textContent = itemName;
const priceSpan = document.createElement("span");
priceSpan.textContent = itemPrice;
const removeBtn = document.createElement("button");
removeBtn.textContent = "✕";
removeBtn.classList.add("remove-btn");
removeBtn.addEventListener("click", () => li.remove());

li.appendChild(nameSpan);
li.appendChild(priceSpan);
li.appendChild(removeBtn);
priceItemsList.appendChild(li);

itemNameInput.value = "";
itemPriceInput.value = "";

});

clearAllBtn.addEventListener("click", () => { priceItemsList.innerHTML = ""; });

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

}); });

