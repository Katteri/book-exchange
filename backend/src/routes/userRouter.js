require('dotenv').config();
const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const authenticateToken = require('../middlewares/auth')

router.get('/', UserController.getAllUsers);
router.get('/my_page', authenticateToken, UserController.getUserPage);
router.get('/:nickname', UserController.getOneUser);

module.exports = router;
