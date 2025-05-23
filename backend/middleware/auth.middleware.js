const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to optionally add user info if token is present
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            req.user = null; // No token, no user attached
            return next();
        }

        // Try to decode token and find user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            req.user = user; // Attach user to request if found
        } else {
            req.user = null;
        }

        next();
    } catch (error) {
        req.user = null; // If token is invalid or user not found, just proceed
        next();
    }
};

// Middleware to restrict roles (optional, depends if you want to use this)
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // If there's no user or their role is not allowed, just proceed without error
        if (!req.user || !roles.includes(req.user.role)) {
            return next();
        }
        next();
    };
};
