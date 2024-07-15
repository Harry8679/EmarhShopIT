import asyncHandler from 'express-async-handler';
import Order from '../models/order.model.js';
import ErrorHandler from '../utils/errorHandler.util.js';

/*----------------- Create a New Order ----------------- */
export const newOrder = asyncHandler(async(req, res, next) => {
    const { orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo } = req.body;

    const order = await Order.create({ orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo, user:req.user._id });

    res.status(200).json({ order });
});

/*----------------- Get Order Details ----------------- */
export const getOrderDetails = asyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('No order found with this ID', 404));
    }

    res.status(200).json({ order });
});

/*----------------- Get Current User Orders ----------------- */
export const myOrders = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler('User not authenticated', 401));
    }
    
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        return next(new ErrorHandler('No orders found for this user', 404));
    }

    res.status(200).json({ success: true, orders });
});