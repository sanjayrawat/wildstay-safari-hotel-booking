const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingType: {
        type: String,
        enum: ['hotel', 'safari'],
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'bookingType'
    },
    guestInfo: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        }
    },
    dates: {
        checkIn: {
            type: Date,
            required: [true, 'Check-in date is required']
        },
        checkOut: {
            type: Date,
            required: function() {
                return this.bookingType === 'hotel';
            }
        }
    },
    guests: {
        adults: {
            type: Number,
            required: true,
            min: [1, 'At least one adult is required']
        },
        children: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    specialRequests: {
        type: String,
        trim: true
    },
    price: {
        basePrice: {
            type: Number,
            required: true
        },
        taxes: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },
    payment: {
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        method: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal'],
            required: function() {
                return this.payment.status === 'completed';
            }
        },
        transactionId: {
            type: String
        },
        paidAt: {
            type: Date
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    cancellation: {
        cancelled: {
            type: Boolean,
            default: false
        },
        cancelledAt: {
            type: Date
        },
        reason: {
            type: String
        },
        refundStatus: {
            type: String,
            enum: ['not_applicable', 'pending', 'processed'],
            default: 'not_applicable'
        }
    }
}, {
    timestamps: true
});

// Middleware to validate dates
bookingSchema.pre('save', function(next) {
    if (this.dates.checkIn && this.dates.checkOut) {
        if (this.dates.checkOut <= this.dates.checkIn) {
            next(new Error('Check-out date must be after check-in date'));
        }
    }
    next();
});

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
    if (this.bookingType === 'hotel' && this.dates.checkIn && this.dates.checkOut) {
        const diffTime = Math.abs(this.dates.checkOut - this.dates.checkIn);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
});

// Virtual for formatted total price
bookingSchema.virtual('formattedTotalPrice').get(function() {
    return `$${this.price.totalPrice.toFixed(2)}`;
});

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function(reason) {
    this.status = 'cancelled';
    this.cancellation.cancelled = true;
    this.cancellation.cancelledAt = new Date();
    this.cancellation.reason = reason;
    this.cancellation.refundStatus = 'pending';
    await this.save();
    return this;
};

// Static method to find upcoming bookings
bookingSchema.statics.findUpcoming = function(email) {
    return this.find({
        'guestInfo.email': email,
        'status': { $nin: ['cancelled', 'completed'] },
        'dates.checkIn': { $gte: new Date() }
    }).sort('dates.checkIn');
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
