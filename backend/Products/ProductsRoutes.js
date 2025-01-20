const express = require('express');
const router = express.Router();
const { getProducts, getProduct } = require('./ProductsController');

router.get('/', getProducts);
router.get('Product/:id', getProduct);

module.exports = router;