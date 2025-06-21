// script.js

document.addEventListener('DOMContentLoaded', function () { const priceItems = document.getElementById("priceItems"); const itemInput = document.getElementById("itemInput"); const priceInput = document.getElementById("priceInput"); const dateInput = document.getElementById("dateInput");

// Set default date to today const today = new Date(); const formattedDate = today.toISOString().split('T')[0]; dateInput.value = formattedDate;

let items = JSON.parse(localStorage.getItem("solarax_items")) || [];

function updateList() { priceItems.innerHTML = ""; items.forEach(({ item, price }, index) => { const li = document.createElement("li"); li.innerHTML = <span>${item}</span> <span>${price}</span> <button class="remove-btn" onclick="removeItem(${index})">&times;</button>; priceItems.appendChild(li); }); localStorage.setItem("solarax_items", JSON.stringify(items)); }

window.addItem = function () { const item = itemInput.value.trim(); const price = priceInput.value.trim(); if (item && price) { items.push({ item, price }); updateList(); itemInput.value = ""; priceInput.value = ""; } };

window.removeItem = function (index) { items.splice(index, 1); updateList(); };

window.removeLast = function () { items.pop(); updateList(); };

window.clearAll = function () { items = []; updateList(); };

window.downloadImage = function () { document.querySelectorAll(".remove-btn").forEach(btn => { btn.style.display = "none"; });

html2canvas(document.getElementById("poster")).then(canvas => {
  const link = document.createElement("a");
  const date = dateInput.value || new Date().toLocaleDateString();
  link.download = `Solarax_Price_List_${date}.png`;
  link.href = canvas.toDataURL();
  link.click();

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.style.display = "inline-block";
  });
});

};

updateList(); });

