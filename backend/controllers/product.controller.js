import asyncHandler from 'express-async-handler';
import Product from '../models/product.model.js';

/*----------------- Get All Products ----------------- */
export const getAllProducts = asyncHandler(async(req, res) => {
    res.status(200).json({
        message: 'All products'
    });
});

/*----------------- Create a Product ----------------- */
export const newProduct = asyncHandler(async(req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({ product });
});