const express = require('express');
const router = express.Router();
const Safari = require('../models/Safari');

// GET /api/safaris
// Get all safaris with filtering and sorting
router.get('/', async (req, res) => {
    try {
        const {
            minPrice,
            maxPrice,
            location,
            duration,
            type,
            wildlife,
            difficulty,
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

        // Duration filter
        if (duration) {
            const [min, max] = duration.split('-').map(Number);
            filter['duration.days'] = {};
            if (min) filter['duration.days'].$gte = min;
            if (max) filter['duration.days'].$lte = max;
        }

        // Safari type filter
        if (type) {
            const typeList = Array.isArray(type) ? type : [type];
            filter.type = { $in: typeList };
        }

        // Wildlife filter
        if (wildlife) {
            const wildlifeList = Array.isArray(wildlife) ? wildlife : [wildlife];
            filter.wildlife = { $in: wildlifeList };
        }

        // Difficulty filter
        if (difficulty) {
            filter.difficulty = difficulty;
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
            case 'duration_short':
                sortObj = { 'duration.days': 1 };
                break;
            case 'duration_long':
                sortObj = { 'duration.days': -1 };
                break;
            case 'rating':
                sortObj = { rating: -1 };
                break;
            default:
                sortObj = { featured: -1, rating: -1 }; // Default sorting for recommended
        }

        const safaris = await Safari.find(filter)
            .sort(sortObj)
            .select('-reviews'); // Exclude reviews for list view

        res.json({
            status: 'success',
            results: safaris.length,
            data: safaris
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching safaris',
            error: error.message
        });
    }
});

// GET /api/safaris/:id
// Get single safari by ID
router.get('/:id', async (req, res) => {
    try {
        const safari = await Safari.findById(req.params.id);
        
        if (!safari) {
            return res.status(404).json({
                status: 'error',
                message: 'Safari not found'
            });
        }

        res.json({
            status: 'success',
            data: safari
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching safari',
            error: error.message
        });
    }
});

// POST /api/safaris/:id/check-availability
// Check safari availability for given date
router.post('/:id/check-availability', async (req, res) => {
    try {
        const { date, groupSize } = req.body;

        if (!date || !groupSize) {
            return res.status(400).json({
                status: 'error',
                message: 'Date and group size are required'
            });
        }

        const safari = await Safari.findById(req.params.id);
        
        if (!safari) {
            return res.status(404).json({
                status: 'error',
                message: 'Safari not found'
            });
        }

        // Check if group size is within limits
        if (groupSize < safari.minGroupSize || groupSize > safari.maxGroupSize) {
            return res.status(400).json({
                status: 'error',
                message: `Group size must be between ${safari.minGroupSize} and ${safari.maxGroupSize}`
            });
        }

        const availableSpots = safari.checkAvailability(new Date(date));

        res.json({
            status: 'success',
            data: {
                available: availableSpots >= groupSize,
                spotsAvailable: availableSpots,
                groupSizeLimits: {
                    min: safari.minGroupSize,
                    max: safari.maxGroupSize
                }
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

// POST /api/safaris/:id/reviews
// Add a review to a safari
router.post('/:id/reviews', async (req, res) => {
    try {
        const { user, rating, comment } = req.body;

        if (!user || !rating || !comment) {
            return res.status(400).json({
                status: 'error',
                message: 'User, rating, and comment are required'
            });
        }

        const safari = await Safari.findById(req.params.id);
        
        if (!safari) {
            return res.status(404).json({
                status: 'error',
                message: 'Safari not found'
            });
        }

        safari.reviews.push({ user, rating, comment });
        await safari.save();

        res.json({
            status: 'success',
            message: 'Review added successfully',
            data: safari
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error adding review',
            error: error.message
        });
    }
});

// GET /api/safaris/featured
// Get featured safaris
router.get('/featured', async (req, res) => {
    try {
        const safaris = await Safari.find({ featured: true })
            .sort('-rating')
            .limit(2)
            .select('-reviews');

        res.json({
            status: 'success',
            results: safaris.length,
            data: safaris
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching featured safaris',
            error: error.message
        });
    }
});

// GET /api/safaris/types
// Get all available safari types
router.get('/types', async (req, res) => {
    try {
        const types = await Safari.distinct('type');
        res.json({
            status: 'success',
            data: types
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching safari types',
            error: error.message
        });
    }
});

// GET /api/safaris/wildlife
// Get all available wildlife options
router.get('/wildlife', async (req, res) => {
    try {
        const wildlife = await Safari.distinct('wildlife');
        res.json({
            status: 'success',
            data: wildlife
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching wildlife options',
            error: error.message
        });
    }
});

module.exports = router;
