const pool = require("../config/db")

exports.addUser = (req, res) => {
    res.send("User add");
};

exports.getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (err, rows) => {
        if (err){
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    })
    res.send("Users list");
};