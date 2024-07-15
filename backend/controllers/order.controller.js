import asyncHandler from 'express-async-handler';
import Order from '../models/order.model.js';
import ErrorHandler from '../utils/errorHandler.util.js';

/*----------------- Create a New Order ----------------- */
export const newOrder = asyncHandler(async(req, res, next) => {
    const { orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo } = req.body;

    const order = await Order.create({ orderItems, shippingInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, paymentMethod, paymentInfo });

    res.status(200).json({ order });
});