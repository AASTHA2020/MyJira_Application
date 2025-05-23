const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Generate JWT Token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || your_secret_key, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};


// Create and send token
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    });
};

// Sign up new user
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        // Send token
        createSendToken(newUser, 201, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            });
        }

        // Send token
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
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
}; 