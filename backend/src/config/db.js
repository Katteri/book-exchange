const Sequelize = require("sequelize");

module.exports = new Sequelize('book_exchange', 'db_user', 'postgres', {
    host: "localhost",
    dialect: 'postgres',
    operatorsAliases: 0,
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});
