/**
 * Safaris page specific JavaScript
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
    const safariListings = document.querySelector('.space-y-6');
    const sortSelect = document.querySelector('select');
    
    if (filterForm && safariListings) {
        const applyFilters = async () => {
            // Show loading state
            safariListings.innerHTML = `
                <div class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            `;

            try {
                // Get filter values
                const price = priceRange.value;
                const duration = Array.from(filterForm.querySelectorAll('input[type="checkbox"]'))
                    .filter(cb => cb.parentElement.textContent.includes('Days'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.nextElementSibling.textContent.trim());

                const safariTypes = Array.from(filterForm.querySelectorAll('input[type="checkbox"]'))
                    .filter(cb => !cb.parentElement.textContent.includes('Days'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.nextElementSibling.textContent.trim());

                const wildlife = Array.from(filterForm.querySelectorAll('.wildlife button'))
                    .filter(btn => btn.classList.contains('bg-blue-50'))
                    .map(btn => btn.textContent.trim());

                // Simulate API call with filters
                const response = await window.utils.apiCall('/api/safaris', {
                    mockData: {
                        safaris: [
                            {
                                name: 'Big Five Safari Adventure',
                                location: 'Serengeti National Park',
                                rating: 4.9,
                                price: 1999,
                                duration: '5 Days',
                                type: ['Game Drive', 'Photography'],
                                wildlife: ['Lions', 'Elephants', 'Leopards'],
                                features: ['All Meals', 'Professional Guide'],
                                image: 'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg',
                                featured: true
                            },
                            {
                                name: 'Great Migration Safari',
                                location: 'Masai Mara',
                                rating: 4.8,
                                price: 2499,
                                duration: '7 Days',
                                type: ['Game Drive', 'Photography'],
                                wildlife: ['Wildebeest', 'Zebras', 'Lions'],
                                features: ['Luxury Camp', 'All Meals'],
                                image: 'https://images.pexels.com/photos/59989/elephant-herd-of-elephants-african-bush-elephant-africa-59989.jpeg',
                                featured: false
                            }
                        ]
                    }
                });

                if (response.success) {
                    let safaris = response.data.safaris;

                    // Apply filters
                    if (duration.length > 0) {
                        safaris = safaris.filter(safari => {
                            const days = parseInt(safari.duration);
                            return duration.some(d => {
                                const [min, max] = d.split('-').map(n => parseInt(n));
                                return days >= min && (max ? days <= max : true);
                            });
                        });
                    }

                    if (safariTypes.length > 0) {
                        safaris = safaris.filter(safari => 
                            safariTypes.some(type => safari.type.includes(type)));
                    }

                    if (wildlife.length > 0) {
                        safaris = safaris.filter(safari => 
                            wildlife.some(animal => safari.wildlife.includes(animal)));
                    }

                    safaris = safaris.filter(safari => safari.price <= price);

                    // Apply sorting
                    const sortBy = sortSelect ? sortSelect.value : 'Recommended';
                    switch (sortBy) {
                        case 'Price: Low to High':
                            safaris.sort((a, b) => a.price - b.price);
                            break;
                        case 'Price: High to Low':
                            safaris.sort((a, b) => b.price - a.price);
                            break;
                        case 'Duration: Shortest to Longest':
                            safaris.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
                            break;
                        default:
                            // For recommended, show featured safaris first
                            safaris.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                    }

                    // Render safaris
                    if (safaris.length === 0) {
                        safariListings.innerHTML = `
                            <div class="text-center py-12">
                                <i class="fas fa-search text-4xl text-gray-400"></i>
                                <p class="mt-4 text-gray-600">No safaris found matching your criteria</p>
                            </div>
                        `;
                        return;
                    }

                    safariListings.innerHTML = safaris.map(safari => `
                        <div class="safari-card bg-white rounded-lg shadow-lg overflow-hidden">
                            <div class="md:flex">
                                <div class="md:w-1/3">
                                    <div class="relative h-full">
                                        <img src="${safari.image}" 
                                             class="w-full h-full object-cover" alt="${safari.name}">
                                        ${safari.featured ? `
                                            <div class="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-2 py-1 rounded-lg text-sm font-medium">
                                                Featured
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="md:w-2/3 p-6">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="text-xl font-semibold">${safari.name}</h3>
                                            <p class="text-gray-600"><i class="fas fa-map-marker-alt"></i> ${safari.location}</p>
                                        </div>
                                        <div class="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            <i class="fas fa-star text-yellow-400 mr-1"></i>
                                            ${safari.rating}
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <p class="text-gray-600">Experience the thrill of seeing Africa's wildlife in their natural habitat. Professional guides and luxury accommodation included.</p>
                                    </div>
                                    <div class="mt-4 flex flex-wrap gap-2">
                                        <span class="px-2 py-1 bg-gray-100 rounded-full text-sm">${safari.duration}</span>
                                        ${safari.type.map(t => 
                                            `<span class="px-2 py-1 bg-gray-100 rounded-full text-sm">${t}</span>`
                                        ).join('')}
                                        ${safari.features.map(f => 
                                            `<span class="px-2 py-1 bg-gray-100 rounded-full text-sm">${f}</span>`
                                        ).join('')}
                                    </div>
                                    <div class="mt-4 flex items-center justify-between">
                                        <div>
                                            <span class="text-2xl font-bold">$${safari.price}</span>
                                            <span class="text-gray-600">/person</span>
                                        </div>
                                        <a href="booking.html" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                                            Book Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            } catch (error) {
                safariListings.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-exclamation-circle text-4xl text-red-500"></i>
                        <p class="mt-4 text-gray-600">Error loading safaris. Please try again.</p>
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

        // Wildlife buttons
        const wildlifeButtons = filterForm.querySelectorAll('.wildlife button');
        wildlifeButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('bg-blue-50');
                button.classList.toggle('border-blue-500');
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
