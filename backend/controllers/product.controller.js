import asyncHandler from 'express-async-handler';

export const products = asyncHandler(async(req, res) => {
    res.status(200).json({
        message: 'All products'
    });
});