import express from 'express';
import { deleteUser, forgotPassword, getAllUsers, getUserDetails, getUserProfile, loginUser, logout, register, resetPassword, updatePassword, updateProfile, updateUser } 
from '../controllers/auth.controller.js';
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
authRoute.put('/admin/users/:id', isAuthenticated, authorizeRoles('admin'), updateUser);
authRoute.delete('/admin/users/:id', isAuthenticated, authorizeRoles('admin'), deleteUser);
export default authRoute;