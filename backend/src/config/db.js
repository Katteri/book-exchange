const Sequelize = require("sequelize");
const Pool = require('pg').Pool

module.exports = new Pool({
    user: "postgres",
    password: "user",
    host: "localhost",
    port: 5432,
    database: "book_exchange"
})