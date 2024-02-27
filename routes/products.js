const express = require('express');
const router = express.Router();
const {
    createProducts,
    getProducts,
    updateProducts,
} = require('../controller/productsController.js');

router.get('/products:id', getProducts);
router.post('/products', createProducts);
router.patch('/products/:id', updateProducts);

module.exports = router;
