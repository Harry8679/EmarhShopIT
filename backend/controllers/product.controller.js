import asyncHandler from 'express-async-handler';
import Product from '../models/product.model.js';
import ErrorHandler from '../utils/errorHandler.util.js';
import APIFilters from '../utils/apiFilters.js';

/*----------------- Get All Products ----------------- */
export const getAllProducts = asyncHandler(async(req, res) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();
    // const products = await Product.find();
    res.status(200).json({
        success: true,
        resPerPage,
        filteredProductsCount,
        products
    });
});

/*----------------- Create a Product ----------------- */
export const newProduct = asyncHandler(async(req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({ product });
});

/*----------------- Get Single product details ----------------- */
export const getProductDetails = asyncHandler(async(req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
        // return res.status(404).json({
        //     error: 'Product not found'
        // });
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