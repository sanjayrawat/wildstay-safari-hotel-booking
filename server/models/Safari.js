const mongoose = require('mongoose');

const safariSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Safari name is required'],
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
    duration: {
        days: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [1, 'Duration must be at least 1 day']
        },
        nights: {
            type: Number,
            required: [true, 'Number of nights is required'],
            min: [0, 'Number of nights cannot be negative']
        }
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    type: [{
        type: String,
        enum: ['Game Drive', 'Walking Safari', 'Bird Watching', 'Photography', 'Night Safari']
    }],
    wildlife: [{
        type: String,
        enum: ['Lions', 'Elephants', 'Giraffes', 'Zebras', 'Leopards', 'Rhinos', 'Buffalo', 'Wildebeest']
    }],
    features: [{
        type: String,
        enum: ['Professional Guide', 'Luxury Camp', 'All Meals', 'Transport', 'Photography Equipment']
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
        spotsAvailable: {
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
    }],
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging'],
        required: true
    },
    minGroupSize: {
        type: Number,
        required: true,
        min: 1
    },
    maxGroupSize: {
        type: Number,
        required: true,
        min: 1
    },
    includes: [{
        type: String,
        required: true
    }],
    excludes: [{
        type: String
    }],
    meetingPoint: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Calculate average rating when reviews are modified
safariSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
    }
    next();
});

// Method to check availability for given dates
safariSchema.methods.checkAvailability = function(date) {
    const availability = this.availability.find(a => {
        return a.startDate <= date && a.endDate >= date && a.spotsAvailable > 0;
    });
    return availability ? availability.spotsAvailable : 0;
};

// Virtual for formatted price
safariSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted duration
safariSchema.virtual('formattedDuration').get(function() {
    return `${this.duration.days} Days / ${this.duration.nights} Nights`;
});

const Safari = mongoose.model('Safari', safariSchema);

module.exports = Safari;
