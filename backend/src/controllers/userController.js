const { QueryTypes } = require('sequelize');
const db = require('../config/db'); // Adjust the path to match your file structure

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
