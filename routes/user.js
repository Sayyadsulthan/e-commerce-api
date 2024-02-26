const express = require('express');
const router = express.Router();

router.get('/user/:id', db.getUsers);
router.patch('/user/:id', db.updateUser);
router.post('/user/', db.updateUser);
