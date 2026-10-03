// js/itinerary.js

let itineraryData = [];

async function loadItinerary() {
    const list = document.getElementById('itinerary-list');
    const countElement = document.getElementById('trip-count');
    const totalCostElement = document.getElementById('total-cost');
    const totalAttractionsElement = document.getElementById('total-attractions');

    // 1. Get saved IDs from localStorage
    const savedIds = JSON.parse(localStorage.getItem('ugandaItinerary')) || [];

    if (savedIds.length === 0) {
        list.innerHTML = '<p style="text-align: center; padding: 2rem;">Your trip is empty. Go to an attraction and click "Add to Itinerary"!</p>';
        countElement.textContent = "0 places";
        totalCostElement.textContent = "0";
        totalAttractionsElement.textContent = "0";
        return;
    }

    try {
        // 2. Fetch all attractions
        const response = await fetch('./json/ugandaDestinations.json');
        const allAttractions = await response.json();

        // 3. Filter to matching items
        itineraryData = allAttractions.filter(place => savedIds.includes(place.id));

        // 4. Calculate totals
        let totalCost = 0;
        itineraryData.forEach(place => totalCost += place.entryFeeUSD);

        countElement.textContent = `${itineraryData.length} places`;
        totalAttractionsElement.textContent = itineraryData.length;
        totalCostElement.textContent = totalCost;

        // 5. Display items
        list.innerHTML = '';
        itineraryData.forEach(place => {
            const itemHTML = `
                <div class="itinerary-item">
                    <img src="${place.image}" alt="${place.name}" onerror="this.src='https://via.placeholder.com/80x60?text=No+Img'">
                    <div class="itinerary-info">
                        <h4>${place.name}</h4>
                        <p>${place.district} • $${place.entryFeeUSD} entry</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromItinerary(${place.id})">Remove</button>
                </div>
            `;
            list.innerHTML += itemHTML;
        });

    } catch (error) {
        console.error("Error loading itinerary:", error);
        list.innerHTML = "<p>Error loading data.</p>";
    }
}

// Remove item
window.removeFromItinerary = function (id) {
    let savedIds = JSON.parse(localStorage.getItem('ugandaItinerary')) || [];
    savedIds = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem('ugandaItinerary', JSON.stringify(savedIds));
    loadItinerary(); // Reload the list
}

// Clear entire trip
document.getElementById('clear-trip-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear your entire trip?")) {
        localStorage.removeItem('ugandaItinerary');
        loadItinerary();
    }
});

// Export Itinerary as a Text File
document.getElementById('export-btn').addEventListener('click', () => {
    if (itineraryData.length === 0) {
        alert("Your trip is empty!");
        return;
    }

    let textContent = "EXPLORE UGANDA - MY TRIP ITINERARY\n";
    textContent += "====================================\n\n";
    let total = 0;

    itineraryData.forEach((place, index) => {
        textContent += `${index + 1}. ${place.name} (${place.district})\n`;
        textContent += `   Category: ${place.category}\n`;
        textContent += `   Entry Fee: $${place.entryFeeUSD} USD\n`;
        textContent += `   Activities: ${place.activities.join(', ')}\n\n`;
        total += place.entryFeeUSD;
    });

    textContent += "====================================\n";
    textContent += `TOTAL ESTIMATED COST: $${total} USD\n`;
    textContent += `Generated on: ${new Date().toLocaleDateString()}\n`;

    // Create a Blob and download link
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Explore_Uganda_Itinerary.txt';
    a.click();
    window.URL.revokeObjectURL(url);
});

document.addEventListener('DOMContentLoaded', loadItinerary);