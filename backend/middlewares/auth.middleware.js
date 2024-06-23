import ErrorHandler from '../utils/errorHandler.util.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

import asyncHanlder from 'express-async-handler';

export const protectedRoute = asyncHanlder(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log('Pas autorisé car pas de token');
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

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource.`, 403));
        }

        next();
    };
};

// Check if user is authenticated or not
export const isAuthenticated = asyncHanlder(async (req, res, next) => {
    console.log('Checking authentication');
    const { token } = req.cookies;
    // console.log('token: ' + token);

    if (!token) {
        console.log('No token found');
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
            }
        });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = await User.findById(decoded.id);
        // console.log('req.user :', req.user);
        
        if (!req.user) {
            console.log('User not found');
            return next(new ErrorHandler('User not found', 404));
        }

        console.log('User authenticated');
        next();
    } catch (error) {
        console.log('Token verification failed');
        return next(new ErrorHandler('Not authorized, token failed', 401));
    }
});


// module.exports = { isAuthenticated, protectedRoute, authorizeRoles };
// export default { isAuthenticated, protectedRoute, authorizeRoles };