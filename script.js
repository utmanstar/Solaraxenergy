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
    dateText.textContent = dateVal ? formatDate(dateVal) : "";
  }

  // Event: On date change
  dateInput.addEventListener("change", updateDate);

  // ✅ Add Item to List
  addItemBtn.addEventListener("click", () => {
    const itemName = itemNameInput.value.trim();
    const itemPrice = itemPriceInput.value.trim();

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

    // Clear inputs
    itemNameInput.value = "";
    itemPriceInput.value = "";
  });

  // ✅ Clear all items
  clearAllBtn.addEventListener("click", () => {
    priceItemsList.innerHTML = "";
  });

  // ✅ Download as Image
  downloadBtn.addEventListener("click", () => {
    updateDate(); // Ensure latest date is visible

    const poster = document.getElementById("poster");

    html2canvas(poster, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `Solarax_Price_List_${formatDate(dateInput.value)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
});
