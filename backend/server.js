require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const customersRoutes = require('./Customers/CustomersRoutes');
const productsRoutes = require('./Products/ProductsRoutes');
const usersRoutes = require('./Users/UsersRoutes');
const registerRoutes = require('./Register/RegisterRoutes');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// RUTAS
app.use('/Customers', customersRoutes);
app.use('/Products', productsRoutes);
app.use('/Users', usersRoutes);
app.use('/api', registerRoutes);


const uploadsPath = path.join(__dirname, '..', 'Uploads');
console.log("Sirviendo archivos estáticos desde:", uploadsPath);

app.use('/Uploads', express.static(uploadsPath));

const PORT = process.env.PORT || 8000;

// INICIAMOS EL SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
