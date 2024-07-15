import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getOrderDetails, newOrder } from '../controllers/order.controller.js';
const orderRoute = express.Router();

orderRoute.post('/new', isAuthenticated, newOrder);
orderRoute.get('/:id', isAuthenticated, getOrderDetails);

export default orderRoute;