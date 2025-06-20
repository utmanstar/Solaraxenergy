document.addEventListener('DOMContentLoaded', () => {
    // ... (All your existing variable declarations and functions) ...

    // --- 4. Event Listeners ---

    // ... (Existing add, clear, and date change listeners) ...

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
                link.download = `solarax_price_list_${dateValue}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => {
                console.error("Error generating image:", error);
                alert("Failed to generate image. Please try again. Check console for details.");
                // Ensure styles are reverted even if there's an error
                containerToCapture.classList.remove('for-image-output');
            });
        }, 50); // Small delay to allow CSS to render
    });

    // ... (Rest of your script.js code) ...
});
