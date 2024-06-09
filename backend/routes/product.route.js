import express from 'express';
import { products } from '../controllers/product.controller.js';

const productsRoute = express.Router();

productsRoute.get('/', products);

export default productsRoute;