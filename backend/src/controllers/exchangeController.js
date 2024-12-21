const { QueryTypes } = require('sequelize');
const db = require('../config/db');

const ExchangeController = {
  async addExchange(req, res) {
    const { isbn, give_user_id, get_nickname } = req.body;
    try {
      const exchange_date = new Date();
      const book_id = await db.query(
        'SELECT book_id FROM book WHERE isbn = :isbn',
        {
          type: QueryTypes.SELECT,
          replacements: {isbn: isbn}
        }
      );
      const get_user_id = await db.query(
        'SELECT user_id FROM users WHERE nickname = :nick',
        {
          type: QueryTypes.SELECT,
          replacements: {nick: get_nickname}
        }
      );
      await db.query(
        `
        INSERT INTO
        exchange(book_id, give_user_id, get_user_id, exchange_date)
        VALUES (?, ?, ?, ?)
        `, 
        {
          type: QueryTypes.INSERT,
          replacements: [book_id, give_user_id, get_user_id, exchange_date]
        }
      );
      res.status(200);
    } catch (error) {
      console.error('Error adding exchange:', error);
      res.status(500).json({ error: 'Failed to add exchange' });
    }
  },
  async findExchangeWanted(req, res) {
    try {
      const {userId} = req.body;
      const exchanges_wanted = await db.query(
        `
        SELECT
        nickname, country_name, city_name, exchange_count, title AS ownership,
        a.first_name, a.middle_name, a.last_name
        FROM wanted w
        JOIN users USING(user_id)
        JOIN country USING(country_id)
        JOIN book USING(book_id)
        JOIN author a USING(author_id)
        JOIN city USING(city_id)
        WHERE user_id = :user_id
        `,
        {
          type: QueryTypes.SELECT,
          replacements: {user_id: userId}
        }
      );
      res.status(200).json(exchanges_wanted);
    } catch (error) {
      console.error('Error finding exchanges:', error);
      res.status(500).json({ error: 'Failed to find exchanges' });
    }
  },
  async findExchangeOwned(req, res) {
    try {
      const {userId} = req.body;
      const exchanges_owned = await db.query(
        `
        SELECT
        nickname, country_name, city_name, exchange_count, title AS ownership,
        a.first_name, a.middle_name, a.last_name
        FROM ownership o
        JOIN users USING(user_id)
        JOIN country USING(country_id)
        JOIN book USING(book_id)
        JOIN author a USING(author_id)
        JOIN city USING(city_id)
        WHERE user_id = :user_id
        `,
      {
        type: QueryTypes.SELECT,
        replacements: {user_id: userId}
      });
      res.status(200).json(exchanges_owned);
    } catch (error) {
      console.error('Error finding exchanges:', error);
      res.status(500).json({ error: 'Failed to find exchanges' });
    }
  }
};

module.exports = ExchangeController;
