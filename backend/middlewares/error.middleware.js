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