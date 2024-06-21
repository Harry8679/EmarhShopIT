import express from 'express';
import { deleteProduct, getAllProducts, getProductDetails, newProduct, updateProduct } from '../controllers/product.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const productsRoute = express.Router();

productsRoute.get('/', isAuthenticated, getAllProducts);
productsRoute.post('/admin', newProduct);
productsRoute.get('/:id', getProductDetails);
productsRoute.put('/:id', updateProduct);
productsRoute.delete('/:id', deleteProduct);

export default productsRoute;