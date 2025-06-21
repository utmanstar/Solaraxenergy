document.addEventListener("DOMContentLoaded", function () {
  const addItemBtn = document.getElementById("addItem");
  const itemNameInput = document.getElementById("itemName");
  const itemPriceInput = document.getElementById("itemPrice");
  const priceItemsList = document.getElementById("priceItems");
  const dateInput = document.getElementById("date");
  const downloadBtn = document.getElementById("download");
  const clearAllBtn = document.getElementById("clearAll");

  // ✅ Format date from yyyy-mm-dd to dd-mm-yyyy
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  // ✅ Update visible date on poster
  function updateDate() {
    const dateText = document.getElementById("poster-date-text");
    const dateVal = dateInput.value;
    dateText.textContent = dateVal ? formatDate(dateVal) : "--/--/----";
    localStorage.setItem("posterDate", dateVal);
  }

  // ✅ Render list item
  function createListItem(name, price) {
    const li = document.createElement("li");

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

  // ✅ Save to localStorage
  function saveItems() {
    const items = [];
    document.querySelectorAll("#priceItems li").forEach(li => {
      const [nameSpan, priceSpan] = li.querySelectorAll("span");
      items.push({ name: nameSpan.textContent, price: priceSpan.textContent });
    });
    localStorage.setItem("priceItems", JSON.stringify(items));
  }

  // ✅ Load from localStorage
  function loadItems() {
    const savedItems = JSON.parse(localStorage.getItem("priceItems") || "[]");
    savedItems.forEach(item => createListItem(item.name, item.price));

    const savedDate = localStorage.getItem("posterDate");
    if (savedDate) {
      dateInput.value = savedDate;
      updateDate();
    }
  }

  // ✅ Event Listeners
  addItemBtn.addEventListener("click", () => {
    const itemName = itemNameInput.value.trim();
    const itemPrice = itemPriceInput.value.trim();

    if (!itemName || !itemPrice) return;

    createListItem(itemName, itemPrice);
    itemNameInput.value = "";
    itemPriceInput.value = "";
    saveItems();
  });

  clearAllBtn.addEventListener("click", () => {
    priceItemsList.innerHTML = "";
    localStorage.removeItem("priceItems");
  });

  dateInput.addEventListener("change", updateDate);

  downloadBtn.addEventListener("click", () => {
    updateDate(); // ensure latest date is reflected

    html2canvas(document.getElementById("poster"), {
      useCORS: true,
      scale: 2,
    }).then(canvas => {
      const link = document.createElement("a");
      const dateStr = formatDate(dateInput.value);
      link.download = `Solarax_Price_List_${dateStr}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });

  loadItems();
});
