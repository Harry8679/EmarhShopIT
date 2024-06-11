import express from 'express';
import { getAllProducts, newProduct } from '../controllers/product.controller.js';

const productsRoute = express.Router();

productsRoute.get('/', getAllProducts);
productsRoute.post('/admin', newProduct);

export default productsRoute;