import express from 'express';
import { forgotPassword, getUserProfile, loginUser, logout, register, resetPassword, updatePassword } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', loginUser);
authRoute.get('/logout', logout);
authRoute.post('/password/forgot', forgotPassword);
authRoute.put('/password/reset/:token', resetPassword);
authRoute.get('/me', isAuthenticated, getUserProfile);
authRoute.post('/password/update', isAuthenticated, updatePassword);
export default authRoute;