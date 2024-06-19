const express = require('express');
const { register } = require('../controllers/auth.controller.js');

const authRoute = express.Router();

authRoute.post('/register', register);

export default authRoute;