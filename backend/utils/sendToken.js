import dotenv from 'dotenv';
dotenv.config();

const sendToken = (user, statusCode, res) => {
    // Create JWT Token
    const token = user.getJwtToken();

    // Check if COOKIE_EXPIRES_TIME is defined
    const cookieExpiresTime = process.env.JWT_EXPIRES_TIME || 7; // Default to 7 days if not defined

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + cookieExpiresTime * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
        sameSite: 'strict', // Helps prevent CSRF attacks
    };

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           success: true,
           token,
           user,
       });
};

export default sendToken;
