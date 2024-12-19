// const pool = require("../config/db")
const { QueryTypes } = require("sequelize");
const db = require("../config/db");

// exports.addUser = (req, res) => {
//     res.send("User add");
// };

// exports.getUsers = (req, res) => {
//     db.query('SELECT * FROM users', (err, rows) => {
//         if (err){
//             console.error(err.message);
//             return res.status(500).send('Internal Server Error');
//         }
//         res.json(rows);
//     })
//     res.send("Users list");
// };

const UserController = {
    // Get all users
    async getAllUsers(req, res) {
      try {
        const users = await db.query('SELECT * FROM users', { type: QueryTypes.SELECT }); // Execute the raw SQL query
        res.status(200).json(users); // Send the result as a JSON response
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' }); // Send an error response
      }
    },
  };
  
  module.exports = UserController;