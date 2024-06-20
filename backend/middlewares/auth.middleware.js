const ErrorHandler = require('../utils/errorHandler.util');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const asyncHanlder = require('express-async-handler');

const protected = asyncHanlder(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401);
            throw new ErrorHandler('Not authorized, please login');
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Get user id from token
        const user = await User.findById(verified.id).select('-password');
        if (!user) {
            res.status(404);
            throw new ErrorHandler('User not found.')
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401);
        throw new ErrorHandler('Not Authorized, please login');
    }
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource.`, 403));
        }

        next();
    };
};

// Check if user is authenticated or not
const isAuthenticated = asyncHanlder(async(req, res, next) => {
    // const { token } = req.cookies;
    const token = req.cookies.token;

    console.log('token', token);

    if (!token) {
        console.log('================================================================');
        console.log('token if not authenticated');
        // return next(new ErrorHandler('Login first to success this resource', 401));
    }

    console.log('after');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded', decoded);
    req.user = await User.findById(decoded.id);
    next();
});

module.exports = { isAuthenticated, protected, authorizeRoles };