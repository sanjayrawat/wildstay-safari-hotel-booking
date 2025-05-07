const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    amenities: [{
        type: String,
        enum: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Parking', 'Room Service']
    }],
    images: [{
        type: String,
        required: [true, 'At least one image is required']
    }],
    availability: [{
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        roomsAvailable: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    featured: {
        type: Boolean,
        default: false
    },
    reviews: [{
        user: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Calculate average rating when reviews are modified
hotelSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
    }
    next();
});

// Method to check availability for given dates
hotelSchema.methods.checkAvailability = function(checkIn, checkOut) {
    const availability = this.availability.find(a => {
        return a.startDate <= checkIn && a.endDate >= checkOut && a.roomsAvailable > 0;
    });
    return availability ? availability.roomsAvailable : 0;
};

// Virtual for formatted price
hotelSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
