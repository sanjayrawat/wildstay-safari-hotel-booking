/**
 * Hotels page specific JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = `$${priceRange.value}`;
        });
    }

    // Filter functionality
    const filterForm = document.querySelector('.filter-section');
    const hotelGrid = document.querySelector('.grid');
    const sortSelect = document.querySelector('select');
    
    if (filterForm && hotelGrid) {
        const applyFilters = async () => {
            // Show loading state
            hotelGrid.innerHTML = `
                <div class="col-span-full flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            `;

            try {
                // Get filter values
                const price = priceRange.value;
                const locations = Array.from(filterForm.querySelectorAll('input[type="checkbox"]'))
                    .filter(cb => cb.parentElement.textContent.includes('Serengeti') || 
                                cb.parentElement.textContent.includes('Masai Mara') || 
                                cb.parentElement.textContent.includes('Kruger Park'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.nextElementSibling.textContent.trim());

                const amenities = Array.from(filterForm.querySelectorAll('input[type="checkbox"]'))
                    .filter(cb => cb.parentElement.textContent.includes('Pool') || 
                                cb.parentElement.textContent.includes('Spa') || 
                                cb.parentElement.textContent.includes('Restaurant') || 
                                cb.parentElement.textContent.includes('WiFi'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.nextElementSibling.textContent.trim());

                const rating = Array.from(filterForm.querySelectorAll('.rating button'))
                    .filter(btn => btn.classList.contains('bg-blue-50'))
                    .map(btn => parseInt(btn.textContent.replace(/[^0-9]/g, '')));

                // Simulate API call with filters
                const response = await window.utils.apiCall('/api/hotels', {
                    mockData: {
                        hotels: [
                            {
                                name: 'Serengeti Lodge',
                                location: 'Serengeti, Tanzania',
                                rating: 4.8,
                                price: 299,
                                amenities: ['WiFi', 'Pool', 'Restaurant'],
                                image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
                            },
                            {
                                name: 'Masai Mara Resort',
                                location: 'Masai Mara, Kenya',
                                rating: 4.9,
                                price: 399,
                                amenities: ['WiFi', 'Spa', 'Restaurant'],
                                image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg'
                            }
                        ]
                    }
                });

                if (response.success) {
                    let hotels = response.data.hotels;

                    // Apply filters
                    if (locations.length > 0) {
                        hotels = hotels.filter(hotel => 
                            locations.some(loc => hotel.location.includes(loc)));
                    }

                    if (amenities.length > 0) {
                        hotels = hotels.filter(hotel => 
                            amenities.every(amenity => hotel.amenities.includes(amenity)));
                    }

                    if (rating.length > 0) {
                        const minRating = Math.min(...rating);
                        hotels = hotels.filter(hotel => hotel.rating >= minRating);
                    }

                    hotels = hotels.filter(hotel => hotel.price <= price);

                    // Apply sorting
                    const sortBy = sortSelect ? sortSelect.value : 'recommended';
                    switch (sortBy) {
                        case 'Price: Low to High':
                            hotels.sort((a, b) => a.price - b.price);
                            break;
                        case 'Price: High to Low':
                            hotels.sort((a, b) => b.price - a.price);
                            break;
                        case 'Rating: High to Low':
                            hotels.sort((a, b) => b.rating - a.rating);
                            break;
                    }

                    // Render hotels
                    if (hotels.length === 0) {
                        hotelGrid.innerHTML = `
                            <div class="col-span-full text-center py-12">
                                <i class="fas fa-search text-4xl text-gray-400"></i>
                                <p class="mt-4 text-gray-600">No hotels found matching your criteria</p>
                            </div>
                        `;
                        return;
                    }

                    hotelGrid.innerHTML = hotels.map(hotel => `
                        <div class="hotel-card bg-white rounded-lg shadow-lg overflow-hidden">
                            <img src="${hotel.image}" 
                                 class="w-full h-48 object-cover" alt="${hotel.name}">
                            <div class="p-6">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="text-xl font-semibold">${hotel.name}</h3>
                                        <p class="text-gray-600"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
                                    </div>
                                    <div class="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                                        ${hotel.rating}
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                                        ${hotel.amenities.map(amenity => 
                                            `<span><i class="fas fa-${
                                                amenity === 'WiFi' ? 'wifi' : 
                                                amenity === 'Pool' ? 'swimming-pool' : 
                                                amenity === 'Restaurant' ? 'utensils' : 
                                                'spa'
                                            }"></i> ${amenity}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                                <div class="mt-4 flex items-center justify-between">
                                    <div>
                                        <span class="text-2xl font-bold">$${hotel.price}</span>
                                        <span class="text-gray-600">/night</span>
                                    </div>
                                    <a href="booking.html" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        Book Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                hotelGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
                        <p class="mt-4 text-gray-600">Error loading hotels. Please try again.</p>
                    </div>
                `;
            }
        };

        // Apply filters button click
        const applyButton = filterForm.querySelector('button');
        if (applyButton) {
            applyButton.addEventListener('click', applyFilters);
        }

        // Sort change
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFilters);
        }

        // Rating buttons
        const ratingButtons = filterForm.querySelectorAll('.rating button');
        ratingButtons.forEach(button => {
            button.addEventListener('click', () => {
                ratingButtons.forEach(btn => btn.classList.remove('bg-blue-50', 'border-blue-500'));
                button.classList.add('bg-blue-50', 'border-blue-500');
                applyFilters();
            });
        });

        // Initial load
        applyFilters();
    }

    // Mobile touch events for filter section
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
        let touchStart = null;
        filterSection.addEventListener('touchstart', (e) => {
            touchStart = e.touches[0].clientY;
        });
        
        filterSection.addEventListener('touchmove', (e) => {
            if (touchStart === null) return;
            
            const touchEnd = e.touches[0].clientY;
            const diff = touchStart - touchEnd;
            
            filterSection.scrollTop += diff;
            touchStart = touchEnd;
            
            e.preventDefault();
        });
    }
});
