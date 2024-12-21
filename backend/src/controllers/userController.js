const { QueryTypes } = require('sequelize');
const db = require('../config/db');

const UserController = {
  async getAllUsers(req, res) {
    try {
      const users = await db.query(
        'SELECT * FROM users',
        {
          type: QueryTypes.SELECT
        }
      );
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },
  async getOneUser(req, res) {
    const { nickname } = req.params.nickname;
    try {
        const user = await db.query(
          'SELECT * FROM get_users_info(?)',
          {
            type: QueryTypes.SELECT,
            replacements: [nickname]
          }
        );
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
};

module.exports = UserController;
