import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import ErrorHandler from '../utils/errorHandler.util.js';
import sendToken from '../utils/sendToken.js';
import { sendEmail } from '../utils/sendEmail.util.js';
// import 
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

    sendToken(user, 200, res);
});

/*----------------- Logout ----------------- */
export const logout = asyncHandler(async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        message: 'Logged out'
    });
});

/*----------------- Forgot Password ----------------- */
export const forgotPassword = asyncHandler(async (req, res, next) => {
    // Find user in the database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = `Hello ${user.name},\n\nYou have requested to reset your password. Please click on the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nBest regards,\nYour Company`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Recovery',
            message,
        });

        res.status(200).json({
            message: `Email sent to ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new ErrorHandler(error.message, 500));
    }
});