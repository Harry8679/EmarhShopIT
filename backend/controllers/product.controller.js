import asyncHandler from 'express-async-handler';
import Product from '../models/product.model.js';

/*----------------- Get All Products ----------------- */
export const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find();
    res.status(200).json({ products });
});

/*----------------- Create a Product ----------------- */
export const newProduct = asyncHandler(async(req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({ product });
});

/*----------------- Get Single product details ----------------- */
export const getProductDetails = asyncHandler(async(req, res) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return res.status(404).json({
            error: 'Product not found'
        });
    }

    res.status(200).json({ product });
});

/*----------------- Update Product Details ----------------- */
export const updateProduct = asyncHandler(async(req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true });

    res.status(200).json({ product });
});

/*----------------- Delete Product ----------------- */
export const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return res.status(404).json({  error: 'Product not found'});
    }

    await product.deleteOne();

    res.status(200).json({ message: 'Product Deleted' });
});