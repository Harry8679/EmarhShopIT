import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import products from './data.js';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Product.deleteMany();
        console.log('All Products are deleted');

        await Product.insertMany(products);
        console.log('Products are added successfully');

        process.exit();
    } catch(error) {
        console.log(error.message);
        process.exit();
    };
};

seedProducts();