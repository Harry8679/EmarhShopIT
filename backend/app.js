import express from 'express';
import dotenv from 'dotenv';
import productsRoute from './routes/product.route.js';
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config({ path: 'backend/.env' });
const app = express();

// Connecting to database
connectDatabase();

app.use(express.json());

app.use('/api/v1/products', productsRoute);

// Using Error Middleware
app.use(errorMiddleware);

const port = process.env.PORT || 6001;

app.listen(port, () => {
    console.log(`Server started on PORT ${port} in ${process.env.NODE_ENV}`);
});