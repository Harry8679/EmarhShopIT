import express from 'express';
import { forgotPassword, loginUser, logout, register } from '../controllers/auth.controller.js';

const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', loginUser);
authRoute.get('/logout', logout);
authRoute.post('/password/forgot', forgotPassword);

export default authRoute;