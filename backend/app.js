import express from 'express';
import dotenv from 'dotenv';
import productsRoute from './routes/product.route.js';

dotenv.config({ path: 'backend/.env' });
const app = express();

app.use('/api/v1/products', productsRoute);

// app.get('/', (req, res) => {
//     res.send('Home Page');
// });

const port = process.env.PORT || 6001;

app.listen(port, () => {
    console.log(`Server started on PORT ${port} in ${process.env.NODE_ENV}`);
});