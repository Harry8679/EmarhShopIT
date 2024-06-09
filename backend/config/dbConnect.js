import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = () => {
    let DB_URI = '';
    if (process.env.NODE_ENV === 'DEVELOPMENT') DB_URI = process.env.MONGO_URI;
    if (process.env.NODE_ENV === 'PRODUCTION') DB_URI = process.env.MONGO_URI;
    mongoose.connect(DB_URI).then((con) => {
        console.log(`MongoDB Database connected with HOST: ${con?.connection?.host}`);
    });
}