const express = require('express');
const router = express.Router();
const { getProduct } = require('./ProductsController');

router.get('Product/:id', getProduct);

module.exports = router;