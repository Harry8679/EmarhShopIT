import express from 'express';
import dotenv from 'dotenv';
import productsRoute from './routes/product.route.js';
import authRoute from './routes/auth.route.js';
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middlewares/error.middleware.js';

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
});

dotenv.config({ path: 'backend/.env' });
const app = express();

// Connecting to database
connectDatabase();

app.use(express.json());

app.use('/api/v1/products', productsRoute);
app.use('/api/v1/users', authRoute);

// Using Error Middleware
app.use(errorMiddleware);

const port = process.env.PORT || 6001;

const server = app.listen(port, () => {
    console.log(`Server started on PORT ${port} in ${process.env.NODE_ENV}`);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1);
    });
});