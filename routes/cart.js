const express = require('express');
const router = express.Router();
const { createcart, getcarts, updatecart } = require('../controller/cartController.js');

router.get('/carts/:userid', getcarts);
router.post('/cart', createcart);
router.patch('/cart/:id', updatecart);

module.exports = router;
