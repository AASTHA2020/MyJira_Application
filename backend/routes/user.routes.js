const express = require('express');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all users (admin only)
router.get('/', restrictTo('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            results: users.length,
            data: {
                users
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get user by ID (admin only)
router.get('/:id', restrictTo('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update user (admin only)
router.patch('/:id', restrictTo('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user (admin only)
router.delete('/:id', restrictTo('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: null
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 