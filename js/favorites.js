// js/favorites.js

async function loadFavorites() {
    const grid = document.getElementById('favorites-grid');
    const countElement = document.getElementById('results-count');

    // 1. Get the list of saved IDs from localStorage
    const savedIds = JSON.parse(localStorage.getItem('ugandaFavorites')) || [];

    if (savedIds.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">You have no favorites yet. Go explore and click the ❤️ icon!</p>';
        countElement.textContent = "0 saved";
        return;
    }

    try {
        // 2. Fetch all attractions
        const response = await fetch('./json/ugandaDestinations.json');
        const allAttractions = await response.json();

        // 3. Filter to only show the saved ones
        const favoriteAttractions = allAttractions.filter(place => savedIds.includes(place.id));

        countElement.textContent = `${favoriteAttractions.length} saved`;

        // 4. Display them
        favoriteAttractions.forEach(place => {
            const cardHTML = `
                <div class="card">
                    <img src="${place.image}" alt="${place.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${place.name}'">
                    <div class="card-content">
                        <h3>${place.name} <span style="float:right; color:red; cursor:pointer;" onclick="removeFavorite(${place.id})" aria-label="Remove ${place.name} from favorites" role="button">❤️</span></h3>
                        <p class="rating">★ ${place.rating} • ${place.category} • ${place.district}</p>
                        <p>${place.description.substring(0, 80)}...</p>
                        <p class="price">From $${place.entryFeeUSD} / person</p>
                        <a href="detail.html?id=${place.id}" class="btn-view" aria-label="View details for ${place.name}">View Details</a>
                    </div>
                </div>
            `;
            grid.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Error loading favorites:", error);
        grid.innerHTML = "<p>Error loading data.</p>";
    }
}

// Function to remove a favorite from this page
window.removeFavorite = function (id) {
    let savedIds = JSON.parse(localStorage.getItem('ugandaFavorites')) || [];
    savedIds = savedIds.filter(savedId => savedId !== id);
    localStorage.setItem('ugandaFavorites', JSON.stringify(savedIds));

    // Reload the page to reflect changes
    location.reload();
}

document.addEventListener('DOMContentLoaded', loadFavorites);