import express from 'express';
import { getAllProducts, getProductDetails, newProduct } from '../controllers/product.controller.js';

const productsRoute = express.Router();

productsRoute.get('/', getAllProducts);
productsRoute.post('/admin', newProduct);
productsRoute.get('/:id', getProductDetails);

export default productsRoute;