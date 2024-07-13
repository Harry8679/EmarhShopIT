import express from 'express';
import { forgotPassword, loginUser, logout, register, resetPassword } from '../controllers/auth.controller.js';

const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', loginUser);
authRoute.get('/logout', logout);
authRoute.post('/password/forgot', forgotPassword);
authRoute.put('/password/reset/:token', resetPassword);
// authRoute.put('/password/reset/:token', resetPassword);

export default authRoute;