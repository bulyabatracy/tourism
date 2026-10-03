// js/main.js

// 1. Global variables to hold our data
let allAttractions = [];
let filteredAttractions = [];

// 2. Fetch the JSON data
async function loadAttractions() {
    const grid = document.getElementById('attractions-grid');
    if (!grid) return; // Exit if we are not on the attractions page

    try {
        const response = await fetch('./json/ugandaDestinations.json');
        allAttractions = await response.json();
        filteredAttractions = [...allAttractions]; // Start with all data

        // Initial display
        applyFilters();
    } catch (error) {
        console.error("Error loading attractions:", error);
        grid.innerHTML = "<p>Error loading data.</p>";
    }
}

// 3. Display the data in the grid
function displayAttractions(attractions) {
    const grid = document.getElementById('attractions-grid');
    const countElement = document.getElementById('results-count');

    if (!grid) return; // Safety check

    grid.innerHTML = ''; // Clear previous results

    if (attractions.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No attractions match your filters.</p>';
        if (countElement) countElement.textContent = "0 results found";
        return;
    }

    if (countElement) countElement.textContent = `${attractions.length} results found`;

    attractions.forEach(place => {
        // Check if this place is already in favorites
        const savedIds = JSON.parse(localStorage.getItem('ugandaFavorites')) || [];
        const isFav = savedIds.includes(place.id);
        const heartColor = isFav ? 'red' : '#ccc';

        const cardHTML = `
            <div class="card">
                <img src="${place.image}" alt="${place.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${place.name}'">
                <div class="card-content">
                    <h3>${place.name} 
                        <span style="float:right; color:${heartColor}; cursor:pointer; font-size:1.5rem;" 
                              onclick="toggleFavorite(${place.id}, this)" aria-label="Toggle favorite status for ${place.name}" role="button">❤</span>
                    </h3>
                    <p class="rating">★ ${place.rating} • ${place.category} • ${place.district}</p>
                    <p>${place.description.substring(0, 80)}...</p>
                    <p class="price">From $${place.entryFeeUSD} / person</p>
                    <a href="detail.html?id=${place.id}" class="btn-view" aria-label="View details for ${place.name}">View Details</a>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// 4. The Main Filtering Logic
function applyFilters() {
    // Safety check: exit if we are not on the attractions page
    if (!document.getElementById('attractions-grid')) return;

    // Get all checked boxes
    const checkedCategories = Array.from(document.querySelectorAll('.filter-category:checked')).map(cb => cb.value);
    const checkedLocations = Array.from(document.querySelectorAll('.filter-location:checked')).map(cb => cb.value);
    const checkedPrices = Array.from(document.querySelectorAll('.filter-price:checked')).map(cb => cb.value);

    // Filter the array
    filteredAttractions = allAttractions.filter(place => {
        // Check Category (if none checked, show all)
        const categoryMatch = checkedCategories.length === 0 || checkedCategories.includes(place.category);

        // Check Location (if none checked, show all)
        const locationMatch = checkedLocations.length === 0 || checkedLocations.includes(place.district);

        // Check Price Range
        let priceMatch = checkedPrices.length === 0;
        if (!priceMatch) {
            for (let range of checkedPrices) {
                if (range === '0-20' && place.entryFeeUSD <= 20) priceMatch = true;
                if (range === '20-50' && place.entryFeeUSD > 20 && place.entryFeeUSD <= 50) priceMatch = true;
                if (range === '50+' && place.entryFeeUSD > 50) priceMatch = true;
            }
        }

        return categoryMatch && locationMatch && priceMatch;
    });

    // Apply Sorting
    applySort();

    // Display the filtered results
    displayAttractions(filteredAttractions);
}

// 5. Sorting Logic
function applySort() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return; // Safety check

    const sortValue = sortSelect.value;

    if (sortValue === 'price-low') {
        filteredAttractions.sort((a, b) => a.entryFeeUSD - b.entryFeeUSD);
    } else if (sortValue === 'price-high') {
        filteredAttractions.sort((a, b) => b.entryFeeUSD - a.entryFeeUSD);
    } else if (sortValue === 'rating') {
        filteredAttractions.sort((a, b) => b.rating - a.rating);
    } else {
        // Recommended (Default: by ID)
        filteredAttractions.sort((a, b) => a.id - b.id);
    }
}

// 6. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the Attractions Page
    const attractionsGrid = document.getElementById('attractions-grid');

    if (attractionsGrid) {
        // --- ATTRACTIONS PAGE LOGIC ---
        loadAttractions();

        // Listen for changes on any checkbox
        document.querySelectorAll('.filter-category, .filter-location, .filter-price').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });

        // Listen for changes on the sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFilters);
        }

        // Reset Filters Button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                if (sortSelect) sortSelect.value = 'recommended';
                applyFilters();
            });
        }
    } else {
        // --- HOME PAGE LOGIC ---
        // Redirect search to the attractions page with the query
        const homeSearchBtn = document.querySelector('.hero .search-bar button');
        const homeSearchInput = document.querySelector('.hero .search-bar input');

        if (homeSearchBtn && homeSearchInput) {
            homeSearchBtn.addEventListener('click', () => {
                const query = homeSearchInput.value.trim();
                if (query) {
                    window.location.href = `attractions.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = 'attractions.html';
                }
            });
        }
    }
});

// 7. Global function to toggle favorites
window.toggleFavorite = function (id, element) {
    let savedIds = JSON.parse(localStorage.getItem('ugandaFavorites')) || [];

    if (savedIds.includes(id)) {
        // Remove it
        savedIds = savedIds.filter(savedId => savedId !== id);
        element.style.color = '#ccc';
    } else {
        // Add it
        savedIds.push(id);
        element.style.color = 'red';
    }

    localStorage.setItem('ugandaFavorites', JSON.stringify(savedIds));
}