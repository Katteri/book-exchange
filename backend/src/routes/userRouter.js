const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/users', UserController.getAllUsers);
router.get('/profile/:nickname', UserController.getOneUser);

module.exports = router;
