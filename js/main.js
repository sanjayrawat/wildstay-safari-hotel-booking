/**
 * Main JavaScript file containing common utilities and functions
 */

// Global notification/alert system
const showAlert = (message, type = 'info') => {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert element
    const alert = document.createElement('div');
    alert.className = `alert fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 
        'bg-blue-500'} text-white`;
    
    alert.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas ${
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'success' ? 'fa-check-circle' : 
                    'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
            <button class="ml-4 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(alert);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
};

// Simulate API call with proper error handling
const apiCall = async (url, options = {}) => {
    try {
        // For demo purposes, simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate API response
        if (Math.random() > 0.9) { // 10% chance of error for testing
            throw new Error('Network error');
        }

        return {
            success: true,
            data: options.mockData || { message: 'Success' }
        };
    } catch (error) {
        console.error('API Error:', error);
        showAlert(error.message, 'error');
        return {
            success: false,
            error: error.message
        };
    }
};

// Date formatting utility
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Input validation utilities
const validators = {
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    phone: (phone) => {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    },
    required: (value) => {
        return value !== null && value !== undefined && value.trim() !== '';
    },
    date: (date) => {
        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    }
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Handle all data-validate inputs
    document.querySelectorAll('[data-validate]').forEach(input => {
        input.addEventListener('blur', () => {
            const validationType = input.dataset.validate;
            const isValid = validators[validationType](input.value);
            
            if (!isValid) {
                input.classList.add('border-red-500');
                showAlert(`Please enter a valid ${validationType}`, 'error');
            } else {
                input.classList.remove('border-red-500');
            }
        });
    });

    // Initialize date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.min = today;
    });
});

// Export utilities for use in other files
window.utils = {
    showAlert,
    apiCall,
    formatDate,
    validators
};
