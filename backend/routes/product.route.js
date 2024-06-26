import express from 'express';
import { deleteProduct, getAllProducts, getProductDetails, newProduct, updateProduct } from '../controllers/product.controller.js';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware.js';

const productsRoute = express.Router();

productsRoute.get('/', getAllProducts);
productsRoute.post('/admin', isAuthenticated, authorizeRoles('admin'), newProduct);
productsRoute.get('/:id', getProductDetails);
productsRoute.put('/:id', updateProduct);
productsRoute.delete('/:id', deleteProduct);

export default productsRoute;