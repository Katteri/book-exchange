require('dotenv').config();
const express = require("express");
const BookController = require("../controllers/bookController");
const router = express.Router();
const authenticateToken = require('../middlewares/auth')

router.post("/wanted/add", authenticateToken, BookController.addBookToWanted);
router.post("/owned/add", authenticateToken, BookController.addBookToOwned);

router.delete("/wanted/delete", authenticateToken, BookController.deleteBookFromWanted);
router.delete("/owned/delete", authenticateToken, BookController.deleteBookFromOwned);

router.get("/wanted/get", authenticateToken, BookController.getMyWantedBooks);
router.get("/owned/get", authenticateToken, BookController.getMyOwnedBooks);

router.get("/wanted/get/:nickname", BookController.getWantedBooks);
router.get("/owned/get/:nickname", BookController.getOwnedBooks);

module.exports = router;
