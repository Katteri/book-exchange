require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path')
const cors = require('cors');

const db = require("./config/db");
const { QueryTypes, json } = require('sequelize');

const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const exchangeRouter = require("./routes/exchangeRouter");
const authRouter = require("./routes/authRouter");


db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(error => console.error('Database connection error:', error)
);

app.use(cors()); 
app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use("/users", userRouter);
app.use("/book", bookRouter);
app.use("/exchange", exchangeRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
