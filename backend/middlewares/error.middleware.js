import ErrorHandler from "../utils/errorHandler.util.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || 'Internal Server Error'
    };

    // Handle Invalid Mongoose ID Error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid : ${err?.path}`;
        error = new ErrorHandler(message, 404);
    }

    // Handle Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    }

    // Handle Wrong JWT Error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is oinvalid. Try again !';
        error = new ErrorHandler(message, 400);

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(error.statusCode).json({
            message: error.message,
            error: error,
            stack: err?.stack
        });
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        res.status(error.statusCode).json({
            message: error.message
        });
    }

    res.status(error.statusCode).json({
        message: error.message,
    });
};