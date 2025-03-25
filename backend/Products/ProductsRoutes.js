const express = require('express');
const router = express.Router();
const { getProducts, getProduct, addProduct } = require('./ProductsController');

router.get('/', getProducts);
router.get('Product/:id', getProduct);
router.get('/addProduct', addProduct);

module.exports = router;