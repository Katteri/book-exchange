const express = require("express");
const exchangeController = require("../controllers/exchangeController");
const router = express.Router();
const authenticateToken = require('../middlewares/auth')

router.post("/add", authenticateToken, exchangeController.addExchange);
router.get("/find/owned", authenticateToken, exchangeController.findExchangeOwned);
router.get("/find/wanted", authenticateToken, exchangeController.findExchangeWanted);


module.exports = router;