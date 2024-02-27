const express = require('express');
const router = express.Router();
const {
    getcarts,
    updatecart,
    addToCart,
    removeFromCart,
} = require('../controller/cartController.js');

router.get('/carts/:userid', getcarts);
router.post('/cart', addToCart);
router.patch('/cart/:id', updatecart);
router.delete('/cart/:id', removeFromCart);

module.exports = router;
