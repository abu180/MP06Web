/*
    ESTE ARCHIVO NOS SERVIRA PARA HACER DE PUENTE ENTRE EL 
    FRONTEND Y BACKEND
*/


const express = require('express');
const router = express.Router();
const { getCustomers, addCustomer, deleteCustomer, updateCustomer, getCustomerById } = require('./CustomersController');

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/addCustomer', addCustomer);
router.delete('/deleteCustomer/:id', deleteCustomer);
router.put('/updateCustomer/:id', updateCustomer);

module.exports = router;