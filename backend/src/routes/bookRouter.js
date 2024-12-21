const express = require("express");
const BookController = require("../controllers/bookController");
const router = express.Router();

router.post("/addwanted", BookController.addBookToWanted);
router.post("/owned/add", BookController.addBookToOwned);

router.delete("/wanted/delete", BookController.deleteBookFromWanted);
router.delete("/owned/delete", BookController.deleteBookFromOwned);

router.get("/wanted/:user_id", BookController.getWantedBooks);
router.get("/owned/:user_id", BookController.getOwnedBooks);

module.exports = router;