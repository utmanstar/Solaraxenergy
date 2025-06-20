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
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('price-item');
        // If it's a "New Item", prompt user for name
        const itemName = name === 'New Item' && !isSaved ? prompt("Enter item name:", "Custom Product") : name;
        if (itemName === null || itemName.trim() === '') {
            return; // User cancelled or entered empty name
        }

        newItemDiv.innerHTML = `
            <label for="item-${itemCount}">${itemName}:</label>
            <input type="number" id="item-${itemCount}" data-item-name="${itemName}" placeholder="Price" value="${price}">
            <button class="remove-item-btn" title="Remove item"><i class="fas fa-trash"></i></button>
        `;
        priceItemsContainer.appendChild(newItemDiv);

        // Add event listener for input change to save state
        const newItemInput = newItemDiv.querySelector(`#item-${itemCount}`);
        newItemInput.addEventListener('input', saveStateToLocalStorage);
        
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
                // Ensure the label text doesn't include the trailing colon
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
            priceDateInput.value = formattedToday;
            localStorage.setItem('solaraxLastSelectedDate', formattedToday);
        }

        const selectedDate = priceDateInput.value;
        const storedItems = localStorage.getItem(`solaraxPriceItems_${selectedDate}`);

        priceItemsContainer.innerHTML = ''; // Clear existing items before loading
        itemCount = 0; // Reset item counter for correct IDs

        if (storedItems) {
            const items = JSON.parse(storedItems);
            items.forEach(item => {
                addItem(item.name, item.price, true); // Pass true for isSaved
            });
        } else {
            // If no data for the current date, load default items
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
            addItem(item.name, item.price, true);
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
        // Temporarily hide buttons that shouldn't appear in the image
        downloadImageBtn.style.display = 'none';
        insertItemBtn.style.display = 'none';
        clearAllBtn.style.display = 'none';
        document.querySelectorAll('.remove-item-btn').forEach(btn => btn.style.display = 'none');

        // Optional: Temporarily remove focus from inputs to hide blinking cursors
        document.activeElement.blur();


        // Use html2canvas to capture the entire container
        html2canvas(containerToCapture, {
            scale: 2, // Higher scale for better quality image
            useCORS: true, // If you have external images/fonts, but typically not needed for this setup
            allowTaint: true, // Allow tainting the canvas if content is from different origin (e.g., logo)
            backgroundColor: '#fff', // Explicitly set background color if container has transparent parts
            logging: false, // Set to true for debugging html2canvas issues
        }).then(canvas => {
            // Re-show hidden elements
            downloadImageBtn.style.display = 'flex'; // Restore as flex if it was flex
            insertItemBtn.style.display = 'flex';
            clearAllBtn.style.display = 'flex';
            document.querySelectorAll('.remove-item-btn').forEach(btn => btn.style.display = 'inline-block'); // Restore as inline-block or whatever it was

            // Create a link element to trigger the download
            const link = document.createElement('a');
            const dateValue = priceDateInput.value;
            link.download = `solarax_price_list_${dateValue}.png`; // Filename based on date
            link.href = canvas.toDataURL('image/png'); // Get image data as PNG
            link.click(); // Programmatically click the link to start download
        }).catch(error => {
            console.error("Error generating image:", error);
            alert("Failed to generate image. Please try again. Check console for details.");
            // Ensure elements are re-shown even if there's an error
            downloadImageBtn.style.display = 'flex';
            insertItemBtn.style.display = 'flex';
            clearAllBtn.style.display = 'flex';
            document.querySelectorAll('.remove-item-btn').forEach(btn => btn.style.display = 'inline-block');
        });
    });

    // Initial load of default items or saved data
    if (!localStorage.getItem(`solaraxPriceItems_${formattedToday}`)) {
        loadDefaultItems(); // Only load defaults if no data exists for today
    }
});
