require('dotenv').config();

const express = require('express');
const cors = require('cors');
const customersRoutes = require('./Customers/CustomersRoutes');
const productsRoutes = require('./Products/ProductsRoutes');

const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//RUTAS
app.use('/Customers', customersRoutes);
app.use('/Products', productsRoutes);

const PORT = process.env.PORT || 8000;

//INICIAMOS EL SERVIDOR
app.listen(PORT, ()=> {
    console.log(`Servidor corriendo`);
})