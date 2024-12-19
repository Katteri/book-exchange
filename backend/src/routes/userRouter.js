const express = require('express');
const UserController = require('../controllers/userController'); // Adjust the path to match your structure

const router = express.Router();

// Define the route to get all users
router.get('/users', UserController.getAllUsers);

module.exports = router;
