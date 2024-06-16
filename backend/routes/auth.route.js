import express from 'express';
import { register } from '../controllers/auth.controller';

const authRoute = express.Router();

authRoute.post('/register', (req, res) => {
    res.send('Welcome');
});

export default authRoute;