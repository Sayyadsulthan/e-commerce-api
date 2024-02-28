const express = require('express');
const router = express.Router();
const { createUser, getUser, updateUser } = require('../controller/userController.js');

// router.get('/user', getUser);
router.patch('/user/:id', updateUser);
router.post('/user/signup', createUser);
router.post('/user/login', getUser);

module.exports = router;
