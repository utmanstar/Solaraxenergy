// script.js

document.addEventListener("DOMContentLoaded", () => { const itemName = document.getElementById("itemName"); const itemPrice = document.getElementById("itemPrice"); const addItemBtn = document.getElementById("addItem"); const clearAllBtn = document.getElementById("clearAll"); const priceItems = document.getElementById("priceItems"); const dateInput = document.getElementById("date"); const dateDisplay = document.getElementById("poster-date-text");

// Load from local storage let items = JSON.parse(localStorage.getItem("priceItems")) || []; let selectedDate = localStorage.getItem("selectedDate") || "";

const updateDateDisplay = () => { const dateValue = dateInput.value; if (dateValue) { const [year, month, day] = dateValue.split("-"); dateDisplay.textContent = ${day}-${month}-${year}; localStorage.setItem("selectedDate", dateValue); } };

if (selectedDate) { dateInput.value = selectedDate; updateDateDisplay(); }

dateInput.addEventListener("change", updateDateDisplay);

const renderItems = () => { priceItems.innerHTML = ""; items.forEach((item, index) => { const li = document.createElement("li"); const nameSpan = document.createElement("span"); const priceSpan = document.createElement("span"); const upBtn = document.createElement("button"); const downBtn = document.createElement("button"); const removeBtn = document.createElement("button");

nameSpan.textContent = item.name;
  priceSpan.textContent = item.price;
  upBtn.textContent = "↑";
  downBtn.textContent = "↓";
  removeBtn.textContent = "✕";

  upBtn.className = "up-btn";
  downBtn.className = "down-btn";
  removeBtn.className = "remove-btn";

  upBtn.onclick = () => {
    if (index > 0) {
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      saveAndRender();
    }
  };

  downBtn.onclick = () => {
    if (index < items.length - 1) {
      [items[index + 1], items[index]] = [items[index], items[index + 1]];
      saveAndRender();
    }
  };

  removeBtn.onclick = () => {
    items.splice(index, 1);
    saveAndRender();
  };

  li.appendChild(nameSpan);
  li.appendChild(priceSpan);
  li.appendChild(upBtn);
  li.appendChild(downBtn);
  li.appendChild(removeBtn);
  priceItems.appendChild(li);
});

};

const saveAndRender = () => { localStorage.setItem("priceItems", JSON.stringify(items)); renderItems(); };

addItemBtn.addEventListener("click", () => { const name = itemName.value.trim(); const price = itemPrice.value.trim(); if (name && price) { items.push({ name, price }); itemName.value = ""; itemPrice.value = ""; saveAndRender(); } });

clearAllBtn.addEventListener("click", () => { if (confirm("Are you sure you want to remove all items?")) { items = []; saveAndRender(); } });

document.getElementById("download").addEventListener("click", () => { const buttons = document.querySelectorAll(".remove-btn, .up-btn, .down-btn"); buttons.forEach(btn => btn.style.display = "none");

html2canvas(document.getElementById("poster")).then(canvas => {
  const link = document.createElement("a");
  link.download = `Solarax_Price_List_${dateDisplay.textContent}.png`;
  link.href = canvas.toDataURL();
  link.click();

  buttons.forEach(btn => btn.style.display = "inline-block");
});

});

renderItems(); });

