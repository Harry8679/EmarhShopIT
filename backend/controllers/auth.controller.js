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
/*----------------- Forgot Password ----------------- */
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

/*----------------- Get Current User Profile ----------------- */
export const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);

    res.status(200).json({ user });
});

/*----------------- Update Password ----------------- */
export const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select('+password');

    // Check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success: true
    });
});

/*----------------- Update Profile ----------------- */
export const updateProfile = asyncHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true
    });

    res.status(200).json({ user })
});

/*----------------- Get All Users ----------------- */
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({ users });
});

/*----------------- Get User Details ----------------- */
export const getUserDetails = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({ user });
});

/*----------------- Update User Details ----------------- */
export const updateUser = asyncHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { new: true });

    res.status(200).json({ user });
});

/*----------------- Delete User ----------------- */
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with id : ${id}`, 404));
    }

    // TODO - Remove user avatar from cloudinary

    await user.deleteOne();

    res.status(200).json({ success: true });
});