import asyncHandler from 'express-async-handler';
// import User from '../models/user.model.js';

/*----------------- Register an Account ----------------- */
export const register = asyncHandler(async(req, res) => {
    res.send('Register');
});