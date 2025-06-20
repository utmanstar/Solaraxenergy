document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Get DOM Elements ---
    const priceItemsContainer = document.getElementById('priceItems');
    const insertItemBtn = document.getElementById('insertItemBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const priceDateInput = document.getElementById('priceDate');
    const containerToCapture = document.querySelector('.container'); // The main container to turn into an image

    let itemCount = 0; // Counter for unique item IDs

    // --- 2. Initial Data Loading & Setup ---

    // Set today's date as default
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    priceDateInput.value = formattedToday;

    // Load saved items and date from Local Storage
    loadStateFromLocalStorage();

    // --- 3. Core Functions ---

    /**
     * Creates and appends a new price item to the list.
     * @param {string} [name='New Item'] - The default name for the item.
     * @param {string} [price=''] - The default price for the item.
     * @param {boolean} [isSaved=false] - Whether this item is being loaded from storage.
     */
    function addItem(name = 'New Item', price = '', isSaved = false) {
        // If it's a "New Item" being added by the user (not loaded from storage), prompt for name
        let itemName = name;
        if (name === 'New Item' && !isSaved) {
            const promptResult = prompt("Enter item name:", "Custom Product");
            if (promptResult === null || promptResult.trim() === '') {
                return; // User cancelled or entered empty name
            }
            itemName = promptResult.trim();
        }

        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('price-item');
        newItemDiv.innerHTML = `
            <label for="item-${itemCount}">${itemName}:</label>
            <input type="number" id="item-${itemCount}" data-item-name="${itemName}" placeholder="Price" value="${price}" step="0.01">
            <button class="remove-item-btn" title="Remove item"><i class="fas fa-trash"></i></button>
        `;
        priceItemsContainer.appendChild(newItemDiv);

        // Add event listener for input change to save state
        const newItemInput = newItemDiv.querySelector(`#item-${itemCount}`);
        if (newItemInput) { // Ensure input exists before adding listener
            newItemInput.addEventListener('input', saveStateToLocalStorage);
        }
        
        itemCount++; // Increment counter for next unique ID
        attachRemoveListeners(newItemDiv.querySelector('.remove-item-btn')); // Attach listener to the new remove button
        saveStateToLocalStorage(); // Save state after adding
    }

    /**
     * Attaches click listeners to remove buttons.
     * @param {HTMLElement} [button=null] - A specific button to attach listener to, or null to re-attach to all.
     */
    function attachRemoveListeners(button = null) {
        if (button) {
            // Attach to a single button
            button.onclick = (event) => {
                const itemDiv = event.target.closest('.price-item');
                if (itemDiv) {
                    itemDiv.remove();
                    saveStateToLocalStorage(); // Save state after removing
                }
            };
        } else {
            // Re-attach to all existing buttons (useful on initial load)
            const removeButtons = document.querySelectorAll('.remove-item-btn');
            removeButtons.forEach(btn => {
                btn.onclick = (event) => {
                    const itemDiv = event.target.closest('.price-item');
                    if (itemDiv) {
                        itemDiv.remove();
                        saveStateToLocalStorage(); // Save state after removing
                    }
                };
            });
        }
    }

    /**
     * Saves the current state of items and selected date to Local Storage.
     * Uses the selected date as part of the key to store daily prices.
     */
    function saveStateToLocalStorage() {
        const selectedDate = priceDateInput.value;
        const items = [];
        priceItemsContainer.querySelectorAll('.price-item').forEach(itemDiv => {
            const label = itemDiv.querySelector('label');
            const input = itemDiv.querySelector('input');
            if (label && input) {
                // Ensure the label text doesn't include the trailing colon for storage
                const itemName = label.textContent.endsWith(':') ? label.textContent.slice(0, -1) : label.textContent;
                items.push({ name: itemName, price: input.value });
            }
        });
        localStorage.setItem(`solaraxPriceItems_${selectedDate}`, JSON.stringify(items));
        localStorage.setItem('solaraxLastSelectedDate', selectedDate); // Save the last selected date
    }

    /**
     * Loads items and the last selected date from Local Storage.
     * Clears current items and populates with loaded data.
     */
    function loadStateFromLocalStorage() {
        const lastSelectedDate = localStorage.getItem('solaraxLastSelectedDate');
        if (lastSelectedDate) {
            priceDateInput.value = lastSelectedDate;
        } else {
            // If no last selected date, use today's date and save it
            const today = new Date(); // Re-define today just in case, though formattedToday is usually fine
            priceDateInput.value = today.toISOString().split('T')[0];
            localStorage.setItem('solaraxLastSelectedDate', priceDateInput.value);
        }

        const selectedDate = priceDateInput.value;
        const storedItems = localStorage.getItem(`solaraxPriceItems_${selectedDate}`);

        priceItemsContainer.innerHTML = ''; // Clear existing items before loading
        itemCount = 0; // Reset item counter for correct IDs

        if (storedItems && JSON.parse(storedItems).length > 0) { // Check if storedItems exists and is not empty
            const items = JSON.parse(storedItems);
            items.forEach(item => {
                addItem(item.name, item.price, true); // Pass true for isSaved
            });
        } else {
            // If no data for the current date or it's empty, load default items
            loadDefaultItems();
        }
    }

    /**
     * Loads the predefined default items.
     */
    function loadDefaultItems() {
        const defaultItems = [
            { name: "Canadian Panel N-Type Bificial (Per Watt)", price: "" },
            { name: "Jinko Panel N-Type Bificial (Per Watt)", price: "" },
            { name: "L2 Structure", price: "" },
            { name: "L3 Structure", price: "" },
            { name: "6mm Cable (Per Yard)", price: "" },
            { name: "4mm Cable (Per Yard)", price: "" }
        ];

        priceItemsContainer.innerHTML = ''; // Clear current items
        itemCount = 0; // Reset counter
        defaultItems.forEach(item => {
            addItem(item.name, item.price, true); // Pass true for isSaved
        });
    }

    // --- 4. Event Listeners ---

    insertItemBtn.addEventListener('click', () => addItem());

    clearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all items for this date?")) {
            priceItemsContainer.innerHTML = '';
            itemCount = 0;
            saveStateToLocalStorage(); // Save empty state
        }
    });

    // When the date changes, load prices for that specific date
    priceDateInput.addEventListener('change', loadStateFromLocalStorage);

    downloadImageBtn.addEventListener('click', () => {
        // --- PRE-CAPTURE: Apply image-specific styles and hide interactive elements ---
        containerToCapture.classList.add('for-image-output'); // Add the class to trigger image styles

        // Optional: Temporarily remove focus from inputs to hide blinking cursors
        document.activeElement.blur();

        // Give the browser a moment to apply styles (optional, but can help with rendering consistency)
        setTimeout(() => {
            html2canvas(containerToCapture, {
                scale: 2, // Higher scale for better quality image
                useCORS: true,
                allowTaint: true,
                backgroundColor: null, // Let CSS background control it
                logging: false,
            }).then(canvas => {
                // --- POST-CAPTURE: Revert styles and show interactive elements ---
                containerToCapture.classList.remove('for-image-output'); // Remove the class

                const link = document.createElement('a');
                const dateValue = priceDateInput.value;
                link.download = `solarax_price_list_${dateValue}.png`; // Filename based on date
                link.href = canvas.toDataURL('image/png'); // Get image data as PNG
                link.click(); // Programmatically click the link to start download
            }).catch(error => {
                console.error("Error generating image:", error);
                alert("Failed to generate image. Please try again. Check console for details.");
                // Ensure styles are reverted even if there's an error
                containerToCapture.classList.remove('for-image-output');
            });
        }, 50); // Small delay to allow CSS to render
    });

    // --- Initial content load on first visit ---
    // If there's no data for today or any last selected date, then load defaults
    // This part is handled by loadStateFromLocalStorage at the top.
    // However, if the page is loaded fresh with no local storage data,
    // loadStateFromLocalStorage will call loadDefaultItems().
    // So, this explicit check here might be redundant but harmless.
});
