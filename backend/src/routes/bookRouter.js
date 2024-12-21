const express = require("express");
const BookController = require("../controllers/bookController");
const router = express.Router();

router.get("/wanted/:user_id", BookController.getWantedBooks);
router.get("/owned/:user_id", BookController.getOwnedBooks);

router.post("/wanted/add", BookController.addBookToWanted);
router.post("/owned/add", BookController.addBookToOwned);

router.delete("/wanted/delete", BookController.deleteBookFromWanted);
router.delete("/owned/delete", BookController.deleteBookFromOwned);

module.exports = router;