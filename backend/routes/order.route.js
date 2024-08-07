import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware.js';
import { getAllOrders, getOrderDetails, myOrders, newOrder, updateOrder } from '../controllers/order.controller.js';
const orderRoute = express.Router();

orderRoute.post('/new', isAuthenticated, newOrder);
orderRoute.get('/me', isAuthenticated, myOrders);
orderRoute.get('/all', isAuthenticated, authorizeRoles('admin'), getAllOrders);
orderRoute.get('/:id', isAuthenticated, getOrderDetails);
orderRoute.put('/:id', isAuthenticated, authorizeRoles('admin'), updateOrder);

export default orderRoute;