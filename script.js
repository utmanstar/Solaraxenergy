document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("addItem");
  const itemNameInput = document.getElementById("itemName");
  const itemPriceInput = document.getElementById("itemPrice");
  const priceItemsList = document.getElementById("priceItems");
  const dateInput = document.getElementById("date");
  const downloadBtn = document.getElementById("download");
  const clearAllBtn = document.getElementById("clearAll");
  const posterDateText = document.getElementById("poster-date-text");

  // Load items from localStorage
  let items = JSON.parse(localStorage.getItem("priceListItems")) || [];
  let selectedDate = localStorage.getItem("selectedDate") || "";

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  function updateDate() {
    const dateVal = dateInput.value;
    if (dateVal) {
      posterDateText.textContent = formatDate(dateVal);
      localStorage.setItem("selectedDate", dateVal);
    }
  }

  function renderItems() {
    priceItemsList.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = item.name;

      const priceSpan = document.createElement("span");
      priceSpan.textContent = item.price;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✕";
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", () => {
        items.splice(index, 1);
        localStorage.setItem("priceListItems", JSON.stringify(items));
        renderItems();
      });

      li.appendChild(nameSpan);
      li.appendChild(priceSpan);
      li.appendChild(removeBtn);
      priceItemsList.appendChild(li);
    });
  }

  addItemBtn.addEventListener("click", () => {
    const itemName = itemNameInput.value.trim();
    const itemPrice = itemPriceInput.value.trim();

    if (!itemName || !itemPrice) return;

    const newItem = { name: itemName, price: itemPrice };
    items.push(newItem);
    localStorage.setItem("priceListItems", JSON.stringify(items));
    renderItems();

    itemNameInput.value = "";
    itemPriceInput.value = "";
  });

  clearAllBtn.addEventListener("click", () => {
    if (confirm("Clear all items?")) {
      items = [];
      localStorage.removeItem("priceListItems");
      renderItems();
    }
  });

  dateInput.addEventListener("change", updateDate);

  downloadBtn.addEventListener("click", () => {
    const poster = document.getElementById("poster");
    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach(btn => btn.style.display = "none");

    updateDate();

    html2canvas(poster, {
      useCORS: true,
      scale: 2
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `Solarax_Price_List_${posterDateText.textContent}.png`;
      link.href = canvas.toDataURL();
      link.click();

      removeBtns.forEach(btn => btn.style.display = "block");
    });
  });

  // Load saved date and items
  if (selectedDate) {
    dateInput.value = selectedDate;
    posterDateText.textContent = formatDate(selectedDate);
  }
  renderItems();
});
