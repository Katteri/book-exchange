const express = require("express");
const BookController = require("../controllers/bookController");
const router = express.Router();

router.get("/book/:isbn", BookController.getBookInfo);

module.exports = router;