// js/detail.js

async function loadDetailPage() {
    const container = document.getElementById('detail-content');

    // 1. Get the ID from the URL (e.g., detail.html?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const attractionId = parseInt(urlParams.get('id'));

    if (!attractionId) {
        container.innerHTML = "<h2>Attraction not found. Please go back to the home page.</h2>";
        return;
    }

    try {
        // 2. Fetch the JSON data
        const response = await fetch('./json/ugandaDestinations.json');
        const data = await response.json();

        // 3. Find the specific attraction by ID
        const place = data.find(item => item.id === attractionId);

        if (!place) {
            container.innerHTML = "<h2>Attraction not found in our database.</h2>";
            return;
        }

        // 4. Check if it's already a favorite to set the heart color
        const savedIds = JSON.parse(localStorage.getItem('ugandaFavorites')) || [];
        const isFav = savedIds.includes(place.id);
        const heartColor = isFav ? 'red' : '#ccc';

        // 5. Build the HTML for the page
        container.innerHTML = `
            <div class="detail-layout">
                
                <!-- LEFT COLUMN: Images & Info -->
                <div class="detail-main">
                    <h1>${place.name} — ${place.category} Experience 
                        <span id="detail-heart" style="color:${heartColor}; cursor:pointer; font-size:1.5rem;" onclick="toggleDetailFavorite(${place.id})">❤</span>
                    </h1>
                    <p class="detail-meta">★ ${place.rating} • ${place.district} • ${place.activities.join(' • ')}</p>
                    
                    <div class="gallery-placeholder">
                        <img src="${place.image}" alt="${place.name}" style="width:100%; height:420px; object-fit:cover; border-radius:12px;"
                             onerror="this.src='https://via.placeholder.com/800x500?text=${encodeURIComponent(place.name)}'">
                    </div>
                    <div class="thumbnail-row">
                        <img src="${place.image}" alt="${place.name} thumbnail 1" style="width:24%; height:90px; object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/200x120?text=${encodeURIComponent(place.name)}'">
                        <img src="${place.image}" alt="${place.name} thumbnail 2" style="width:24%; height:90px; object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/200x120?text=${encodeURIComponent(place.name)}'">
                        <img src="${place.image}" alt="${place.name} thumbnail 3" style="width:24%; height:90px; object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/200x120?text=${encodeURIComponent(place.name)}'">
                        <img src="${place.image}" alt="${place.name} thumbnail 4" style="width:24%; height:90px; object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/200x120?text=${encodeURIComponent(place.name)}'">
                    </div>

                    <div class="description-box">
                        <h3>DESCRIPTION</h3>
                        <p>${place.description}</p>
                        <ul>
                            <li>Entry Fee: UGX ${place.entryFeeUGX.toLocaleString()}</li>
                            <li>Activities: ${place.activities.join(', ')}</li>
                            <li>Location: ${place.district}, Uganda</li>
                        </ul>
                    </div>

                    <div class="reviews-box">
                        <h3>REVIEWS (24)</h3>
                        <p><strong>Aisha K.</strong> — ★★★★★ — 2 days ago<br>Beautiful, serene atmosphere. Loved the gardens.</p>
                        <p><strong>David M.</strong> — ★★★★☆ — 1 week ago<br>Very calm. Easy to get to from city center.</p>
                    </div>
                </div>

                <!-- RIGHT COLUMN: Booking & Map -->
                <div class="detail-sidebar">
                    <div class="booking-card">
                        <h3>Book Your Visit</h3>
                        <form class="booking-form" onsubmit="event.preventDefault(); alert('Booking confirmed! Check your email.');">
                            <label>Date:</label>
                            <input type="date" required>
                            
                            <label>Guests:</label>
                            <select>
                                <option>1 guest</option>
                                <option selected>2 guests</option>
                                <option>3 guests</option>
                                <option>4+ guests</option>
                            </select>

                            <label>Price:</label>
                            <input type="text" value="UGX ${place.entryFeeUGX.toLocaleString()} per person" readonly>

                            <button type="submit" class="book-btn">BOOK NOW →</button>
                            <p style="font-size:0.8rem; text-align:center; margin-top:10px;">* Confirmation will be emailed. Free cancellation up to 24h.</p>
                            
                            <!-- NEW BUTTON HERE -->
                            <button type="button" class="book-btn" style="background: var(--secondary-orange); margin-top: 1rem;" onclick="addToItinerary(${place.id})">Add to Itinerary 🗺️</button>
                        </form>
                    </div>

                    <div class="booking-card">
                        <h3>LOCATION & MAP</h3>
                        <!-- UPDATED TO IFRAME (No API key needed) -->
                        <iframe 
                            width="100%" 
                            height="250" 
                            style="border:0; border-radius: 8px; margin-top: 10px;" 
                            loading="lazy" 
                            allowfullscreen
                            src="https://www.google.com/maps?q=${place.latitude},${place.longitude}&output=embed">
                        </iframe>
                        <p style="font-size:0.9rem; margin-top:10px;"><strong>Location:</strong> ${place.district}, Uganda</p>
                        <p><a href="https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}" target="_blank">[ Open in Maps → ]</a></p>
                    </div>

                    <div class="booking-card">
                        <h3>DETAILS</h3>
                        <ul style="padding-left: 20px; font-size: 0.9rem;">
                            <li>Opening Hours: 9:00am – 6:00pm daily</li>
                            <li>Duration: ~1-2 hours</li>
                            <li>Accessibility: Parking available, wheelchair accessible</li>
                        </ul>
                    </div>
                </div>

            </div>
        `;

    } catch (error) {
        console.error("Error loading details:", error);
        container.innerHTML = "<h2>Error loading data. Please try again later.</h2>";
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', loadDetailPage);

// Global function to toggle favorites
window.toggleDetailFavorite = function (id) {
    let savedIds = JSON.parse(localStorage.getItem('ugandaFavorites')) || [];
    const heart = document.getElementById('detail-heart');

    if (savedIds.includes(id)) {
        savedIds = savedIds.filter(savedId => savedId !== id);
        heart.style.color = '#ccc';
    } else {
        savedIds.push(id);
        heart.style.color = 'red';
    }
    localStorage.setItem('ugandaFavorites', JSON.stringify(savedIds));
}

// NEW: Global function to add to itinerary
window.addToItinerary = function (id) {
    let savedIds = JSON.parse(localStorage.getItem('ugandaItinerary')) || [];

    if (savedIds.includes(id)) {
        alert("This attraction is already in your itinerary!");
        return;
    }

    savedIds.push(id);
    localStorage.setItem('ugandaItinerary', JSON.stringify(savedIds));
    alert("Added to your itinerary! View it in the 'My Trip 🗺️' tab.");
}