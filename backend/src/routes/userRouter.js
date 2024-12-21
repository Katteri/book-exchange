const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:nickname', UserController.getOneUser);

module.exports = router;
