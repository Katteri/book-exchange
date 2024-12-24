require('dotenv').config();
const express = require("express");
const exchangeController = require("../controllers/exchangeController");
const router = express.Router();
const authenticateToken = require('../middlewares/auth')

router.post("/add", authenticateToken, exchangeController.addExchange);
router.get("/find", authenticateToken, exchangeController.findExchange);

module.exports = router;
