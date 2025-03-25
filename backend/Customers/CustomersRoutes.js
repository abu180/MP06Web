// backend/Customers/CustomersRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCustomers,
  addCustomer,
  deactivateCustomer,
  activateCustomer,
  updateCustomer,
  getCustomerById,
  getRemovedCustomers
} = require('./CustomersController');

// Rutas para los clientes
router.get('/', getCustomers);                      // Obtener todos los clientes activos
router.get('/removed', getRemovedCustomers);        // Obtener clientes eliminados (is_active = 0)
router.get('/:id', getCustomerById);                // Obtener un cliente por ID
router.post('/addCustomer', addCustomer);           // Crear un nuevo cliente
router.put('/deactivateCustomer/:id', deactivateCustomer);  // Dar de baja un cliente
router.put('/activateCustomer/:id', activateCustomer);      // Dar de alta un cliente
router.delete('/deleteCustomer/:id', deactivateCustomer);   // Eliminar (soft delete) un cliente
router.put('/updateCustomer/:id', updateCustomer);  // Actualizar un cliente

module.exports = router;
