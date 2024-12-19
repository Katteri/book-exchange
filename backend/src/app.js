const express = require('express');
const app = express();
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
// const pool = require("./config/db");

// pool.connect().catch(error => console.error(error))
const db = require("./config/db");

db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(error => console.error('Database connection error:', error));

app.use(express.json()); // Parse JSON request bodies
app.use(userRouter); // Register the routes
app.use(bookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));