// script.js

document.addEventListener('DOMContentLoaded', function () { const itemInput = document.getElementById('itemInput'); const priceInput = document.getElementById('priceInput'); const priceItems = document.getElementById('priceItems'); const dateInput = document.getElementById('dateInput');

const today = new Date(); dateInput.value = today.toISOString().split('T')[0];

let items = JSON.parse(localStorage.getItem('solarax_items')) || [];

function updateList() { priceItems.innerHTML = ''; items.forEach(({ item, price }, index) => { const li = document.createElement('li'); li.innerHTML = <span>${item}</span> <span>${price}</span> <button class="remove-btn" data-index="${index}">&times;</button>; priceItems.appendChild(li); }); localStorage.setItem('solarax_items', JSON.stringify(items)); }

function addItem() { const item = itemInput.value.trim(); const price = priceInput.value.trim(); if (item && price) { items.push({ item, price }); updateList(); itemInput.value = ''; priceInput.value = ''; } }

function removeItem(index) { items.splice(index, 1); updateList(); }

function removeLast() { items.pop(); updateList(); }

function clearAll() { items = []; updateList(); }

function downloadImage() { document.querySelectorAll(".remove-btn").forEach(btn => btn.style.display = 'none');

html2canvas(document.getElementById('poster')).then(canvas => {
  const link = document.createElement('a');
  const date = dateInput.value || new Date().toLocaleDateString();
  link.download = `Solarax_Price_List_${date}.png`;
  link.href = canvas.toDataURL();
  link.click();

  document.querySelectorAll(".remove-btn").forEach(btn => btn.style.display = 'inline-block');
});

}

// Assign functions to global scope so HTML buttons work window.addItem = addItem; window.removeLast = removeLast; window.clearAll = clearAll; window.downloadImage = downloadImage;

// Handle remove button via event delegation priceItems.addEventListener('click', function (e) { if (e.target.classList.contains('remove-btn')) { const index = parseInt(e.target.getAttribute('data-index')); removeItem(index); } });

updateList(); });

