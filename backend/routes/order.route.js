import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { newOrder } from '../controllers/order.controller.js';
const orderRoute = express.Router();

orderRoute.post('/new', isAuthenticated, newOrder);

export default orderRoute;