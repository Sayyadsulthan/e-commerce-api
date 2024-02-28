const express = require('express');
const router = express.Router();
const {
    createProducts,
    getProducts,
    updateProducts,
    getOneProduct,
} = require('../controller/productsController.js');

// find all products on category query else gets random products
router.get('/products', getProducts);
router.get('/products/:id', getOneProduct);
// create product
router.post('/products', createProducts);
// update product on product id
router.patch('/products/:id', updateProducts);

module.exports = router;
