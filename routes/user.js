const express = require('express');
const router = express.Router();
const { createUser, getUser, updateUser } = require('../controller/userController.js');

router.get('/user/:id', getUser);
router.patch('/user/:id', updateUser);
router.post('/user', createUser);

module.exports = router;
