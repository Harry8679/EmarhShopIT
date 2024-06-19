import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
// import User from '../models/user.model.js';

/*----------------- Register an Account ----------------- */
export const register = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;

    
    const user = await User.create({ name, email, password });

    const token = user.getJwtToken();

    res.status(201).json({ token });
});