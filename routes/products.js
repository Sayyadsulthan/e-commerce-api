const express = require('express');
const router = express.Router();
const {
    createProducts,
    getProducts,
    updateProducts,
} = require('../controller/productsController.js');

router.get('/products/:id', getProducts);
router.patch('/products/:id', updateProducts);
router.post('/products', createProducts);

module.exports = router;
