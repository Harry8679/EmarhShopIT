import express from 'express';
import { forgotPassword, getAllUsers, getUserDetails, getUserProfile, loginUser, logout, register, resetPassword, updatePassword, updateProfile } from '../controllers/auth.controller.js';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware.js';

const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', loginUser);
authRoute.get('/logout', logout);
authRoute.post('/password/forgot', forgotPassword);
authRoute.put('/password/reset/:token', resetPassword);
authRoute.get('/me', isAuthenticated, getUserProfile);
authRoute.post('/me/update', isAuthenticated, updateProfile);
authRoute.post('/password/update', isAuthenticated, updatePassword);

authRoute.get('/admin/users', isAuthenticated, authorizeRoles('admin'), getAllUsers);
authRoute.get('/admin/users/:id', isAuthenticated, authorizeRoles('admin'), getUserDetails);
export default authRoute;