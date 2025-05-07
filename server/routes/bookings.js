const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings
// Create a new booking
router.post('/', async (req, res) => {
    try {
        const bookingData = req.body;

        // Basic validation can be enhanced
        if (!bookingData.bookingType || !bookingData.itemId || !bookingData.guestInfo) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required booking data'
            });
        }

        const booking = new Booking(bookingData);
        await booking.save();

        res.status(201).json({
            status: 'success',
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// GET /api/bookings/:id
// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        res.json({
            status: 'success',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

// GET /api/bookings
// Get all bookings (optionally filter by guest email)
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        let filter = {};

        if (email) {
            filter['guestInfo.email'] = email;
        }

        const bookings = await Booking.find(filter).sort('-createdAt');

        res.json({
            status: 'success',
            results: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// PUT /api/bookings/:id/cancel
// Cancel a booking
router.put('/:id/cancel', async (req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                status: 'error',
                message: 'Booking is already cancelled'
            });
        }

        booking.status = 'cancelled';
        booking.cancellation.cancelled = true;
        booking.cancellation.cancelledAt = new Date();
        booking.cancellation.reason = reason || 'No reason provided';
        booking.cancellation.refundStatus = 'pending';

        await booking.save();

        res.json({
            status: 'success',
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error cancelling booking',
            error: error.message
        });
    }
});

module.exports = router;
