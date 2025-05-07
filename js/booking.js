/**
 * Booking page specific JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const pricePerNight = 299; // Default price, would come from API in real app

    // Update price summary based on dates
    const updatePriceSummary = () => {
        const checkIn = new Date(document.querySelector('input[type="date"]:first-of-type').value);
        const checkOut = new Date(document.querySelector('input[type="date"]:last-of-type').value);
        
        if (!isNaN(checkIn) && !isNaN(checkOut)) {
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            if (nights > 0) {
                const subtotal = pricePerNight * nights;
                const taxes = subtotal * 0.1; // 10% tax rate
                const total = subtotal + taxes;

                document.querySelector('.space-y-2').innerHTML = `
                    <div class="flex justify-between">
                        <span class="text-gray-600">Room Rate (per night)</span>
                        <span>$${pricePerNight}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Number of Nights</span>
                        <span>${nights}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Taxes & Fees</span>
                        <span>$${taxes.toFixed(2)}</span>
                    </div>
                    <div class="border-t pt-2 mt-2">
                        <div class="flex justify-between font-bold">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                `;
            }
        }
    };

    // Handle date input changes
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.addEventListener('change', updatePriceSummary);
    });

    // Show payment modal
    const showPaymentModal = () => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-semibold mb-4">Payment Details</h3>
                <form id="paymentForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" 
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                               maxlength="19" required>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   maxlength="5" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">CVV</label>
                            <input type="text" placeholder="123" 
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                   maxlength="3" required>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" class="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                onclick="this.closest('.fixed').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Pay Now
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle payment form submission
        const paymentForm = document.getElementById('paymentForm');
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            modal.remove();
            
            // Show processing overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p class="mt-4">Processing your payment...</p>
                </div>
            `;
            document.body.appendChild(overlay);

            // Simulate payment processing
            try {
                const response = await window.utils.apiCall('/api/payment', {
                    mockData: { bookingId: 'BK' + Date.now() }
                });

                if (response.success) {
                    overlay.remove();
                    window.utils.showAlert('Booking confirmed successfully!', 'success');
                    
                    // Update booking progress
                    document.querySelectorAll('.booking-progress .step').forEach(step => {
                        step.querySelector('.w-8').classList.remove('bg-gray-200', 'text-gray-600');
                        step.querySelector('.w-8').classList.add('bg-blue-600', 'text-white');
                        step.querySelector('.text-sm').classList.remove('text-gray-600');
                    });

                    // Disable form inputs
                    bookingForm.querySelectorAll('input, select, textarea').forEach(input => {
                        input.disabled = true;
                    });
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                overlay.remove();
                window.utils.showAlert('Payment failed. Please try again.', 'error');
            }
        });
    };

    // Handle booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all required fields
            const requiredFields = bookingForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!window.utils.validators.required(field.value)) {
                    field.classList.add('border-red-500');
                    isValid = false;
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (!isValid) {
                window.utils.showAlert('Please fill in all required fields', 'error');
                return;
            }

            // Show payment modal if validation passes
            showPaymentModal();
        });
    }
});
