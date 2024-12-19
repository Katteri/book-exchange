const Sequelize = require("sequelize");
// const Pool = require('pg').Pool

// module.exports = new Pool({
//     user: "postgres",
//     password: "user",
//     host: "localhost",
//     port: 5432,
//     database: "book_exchange"
// })

module.exports = new Sequelize('book_exchange', 'postgres', 'user', {
    host: "localhost",
    dialect: 'postgres',
    operatorsAliases: 0,
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
})