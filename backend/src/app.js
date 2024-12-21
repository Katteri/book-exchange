require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path')

const db = require("./config/db");
const { QueryTypes, json } = require('sequelize');

const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const exchangeRouter = require("./routes/exchangeRouter");
const authRouter = require("./routes/authRouter");


db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(error => console.error('Database connection error:', error));

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use("/users", userRouter);
app.use("/book", bookRouter);
app.use("/exchange", exchangeRouter);
app.use("/auth", authRouter);
app.use("/debug/books", async (req, res) => {
  books = await db.query(
    'SELECT * FROM books',
    {
      type: QueryTypes.SELECT,
    }
  );
  res.status(200).json(books)
})
app.use("/debug/wanted", async (req, res) => {
  wantedlist = await db.query(
    'SELECT * FROM wanted',
    {
      type: QueryTypes.SELECT,
    }
  );
  res.status(200).json(wantedlist)
})
app.use("/debug/owned", async (req, res) => {
  ownedlist = await db.query(
    'SELECT * FROM owned',
    {
      type: QueryTypes.SELECT,
    }
  );
  res.status(200).json(ownedlist)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app._router.stack.forEach((middleware) => {
  if (middleware.route) { // routes registered directly on the app
      console.log(middleware.route);
  } else if (middleware.name === 'router') { // router middleware
      middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
              console.log(handler.route);
          }
      });
  }
});