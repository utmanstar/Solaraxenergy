// script.js

const priceItems = document.getElementById("priceItems"); const itemInput = document.getElementById("itemInput"); const priceInput = document.getElementById("priceInput"); const dateInput = document.getElementById("dateInput");

let items = JSON.parse(localStorage.getItem("solarax_items")) || [];

function updateList() { priceItems.innerHTML = ""; items.forEach(({ item, price }, index) => { const li = document.createElement("li"); li.innerHTML = <span>${item}</span> <span>${price}</span> <button class="remove-btn" onclick="removeItem(${index})">&times;</button>; priceItems.appendChild(li); }); localStorage.setItem("solarax_items", JSON.stringify(items)); }

function addItem() { const item = itemInput.value.trim(); const price = priceInput.value.trim(); if (item && price) { items.push({ item, price }); updateList(); itemInput.value = ""; priceInput.value = ""; } }

function removeItem(index) { items.splice(index, 1); updateList(); }

function removeLast() { items.pop(); updateList(); }

function clearAll() { items = []; updateList(); }

function downloadImage() { // Hide cross buttons before rendering document.querySelectorAll(".remove-btn").forEach(btn => { btn.style.display = "none"; });

html2canvas(document.getElementById("poster")).then(canvas => { const link = document.createElement("a"); const date = dateInput.value || new Date().toLocaleDateString(); link.download = Solarax_Price_List_${date}.png; link.href = canvas.toDataURL(); link.click();

// Restore cross buttons after download
document.querySelectorAll(".remove-btn").forEach(btn => {
  btn.style.display = "inline-block";
});

}); }

window.onload = updateList;

