import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import ErrorHandler from '../utils/errorHandler.util.js';
import sendToken from '../utils/sendToken.js';
import { sendEmail } from '../utils/sendEmail.util.js';
import { getResetPasswordTemplate } from '../utils/emailTemplate.util.js';
import crypto from 'crypto';
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

    const message = getResetPasswordTemplate(user?.name, resetUrl);

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

// Reset Password => /api/v1/password/reset/:token
export const resetPassword = asyncHandler(async (req, res, next) => {
    // Hash the URL Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    // Set the new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});