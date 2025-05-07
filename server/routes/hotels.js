const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// GET /api/hotels
// Get all hotels with filtering and sorting
router.get('/', async (req, res) => {
    try {
        const {
            minPrice,
            maxPrice,
            location,
            amenities,
            rating,
            sort = 'recommended'
        } = req.query;

        // Build filter object
        const filter = {};

        // Price filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Location filter
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Amenities filter
        if (amenities) {
            const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
            filter.amenities = { $all: amenitiesList };
        }

        // Rating filter
        if (rating) {
            filter.rating = { $gte: Number(rating) };
        }

        // Build sort object
        let sortObj = {};
        switch (sort) {
            case 'price_low':
                sortObj = { price: 1 };
                break;
            case 'price_high':
                sortObj = { price: -1 };
                break;
            case 'rating':
                sortObj = { rating: -1 };
                break;
            default:
                sortObj = { featured: -1, rating: -1 }; // Default sorting for recommended
        }

        const hotels = await Hotel.find(filter)
            .sort(sortObj)
            .select('-reviews'); // Exclude reviews for list view

        res.json({
            status: 'success',
            results: hotels.length,
            data: hotels
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching hotels',
            error: error.message
        });
    }
});

// GET /api/hotels/:id
// Get single hotel by ID
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel not found'
            });
        }

        res.json({
            status: 'success',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching hotel',
            error: error.message
        });
    }
});

// POST /api/hotels/:id/check-availability
// Check hotel availability for given dates
router.post('/:id/check-availability', async (req, res) => {
    try {
        const { checkIn, checkOut } = req.body;

        if (!checkIn || !checkOut) {
            return res.status(400).json({
                status: 'error',
                message: 'Check-in and check-out dates are required'
            });
        }

        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel not found'
            });
        }

        const availableRooms = hotel.checkAvailability(new Date(checkIn), new Date(checkOut));

        res.json({
            status: 'success',
            data: {
                available: availableRooms > 0,
                rooms: availableRooms
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error checking availability',
            error: error.message
        });
    }
});

// POST /api/hotels/:id/reviews
// Add a review to a hotel
router.post('/:id/reviews', async (req, res) => {
    try {
        const { user, rating, comment } = req.body;

        if (!user || !rating || !comment) {
            return res.status(400).json({
                status: 'error',
                message: 'User, rating, and comment are required'
            });
        }

        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel not found'
            });
        }

        hotel.reviews.push({ user, rating, comment });
        await hotel.save();

        res.json({
            status: 'success',
            message: 'Review added successfully',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error adding review',
            error: error.message
        });
    }
});

// GET /api/hotels/featured
// Get featured hotels
router.get('/featured', async (req, res) => {
    try {
        const hotels = await Hotel.find({ featured: true })
            .sort('-rating')
            .limit(3)
            .select('-reviews');

        res.json({
            status: 'success',
            results: hotels.length,
            data: hotels
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching featured hotels',
            error: error.message
        });
    }
});

module.exports = router;
