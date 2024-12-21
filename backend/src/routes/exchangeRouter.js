const express = require("express");
const exchangeController = require("../controllers/exchangeController");
const router = express.Router();

router.post("/add", exchangeController.addExchange);
router.get("/find/owned", exchangeController.findExchangeOwned);
router.get("/find/wanted", exchangeController.findExchangeWanted);


module.exports = router;