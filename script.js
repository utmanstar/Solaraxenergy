const priceItems = document.getElementById("priceItems");
const itemInput = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const dateInput = document.getElementById("dateInput");

let items = JSON.parse(localStorage.getItem("solarax_items")) || [];

function updateList() {
  priceItems.innerHTML = "";
  items.forEach(({ item, price }) => {
    const li = document.createElement("li");
    li.textContent = item;
    const span = document.createElement("span");
    span.textContent = price;
    li.appendChild(span);
    priceItems.appendChild(li);
  });
  localStorage.setItem("solarax_items", JSON.stringify(items));
}

function addItem() {
  const item = itemInput.value.trim();
  const price = priceInput.value.trim();
  if (item && price) {
    items.push({ item, price });
    updateList();
    itemInput.value = "";
    priceInput.value = "";
  }
}

function removeLast() {
  items.pop();
  updateList();
}

function clearAll() {
  items = [];
  updateList();
}

function downloadImage() {
  const date = dateInput.value;
  html2canvas(document.getElementById("poster")).then(canvas => {
    const link = document.createElement("a");
    link.download = `Solarax_Price_List_${date}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

window.onload = () => updateList();
