import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import ErrorHandler from '../utils/errorHandler.util.js';
import sendToken from '../utils/sendToken.js';
// import User from '../models/user.model.js';

/*----------------- Register an Account ----------------- */
export const register = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;

    
    const user = await User.create({ name, email, password });

    const token = user.getJwtToken();

    // res.status(201).json({ token });
    sendToken(user, 201, res);
});

/*----------------- Login ----------------- */
export const loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Find user in the database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid or password', 401));
    }

    sendToken(user, 201, res);
});