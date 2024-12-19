exports.addUser = (req, res) => {
    res.send("User add");
};

exports.getUsers = (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err){
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    })
    res.send("Users list");
};