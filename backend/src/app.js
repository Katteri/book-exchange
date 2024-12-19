const express = require('express');
const app = express();
const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const pool = require("./config/db");

pool.connect().catch(error => console.error(error))

app.use("/users", userRouter);
app.use("/", homeRouter);

// 404 error
app.use((req, res, next) => {
    res.status(404).send("Not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});