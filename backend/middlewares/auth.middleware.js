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

module.exports = { protected, authorizeRoles };