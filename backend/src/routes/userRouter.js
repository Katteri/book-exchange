const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.use("/create", userController.addUser);
userRouter.get("/users", userController.getUsers);

module.exports = userRouter;