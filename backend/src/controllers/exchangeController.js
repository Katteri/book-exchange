require('dotenv').config();
const { QueryTypes } = require('sequelize');
const db = require('../config/db');

const ExchangeController = {
  async addExchange(req, res) {
    const nickname = req.user.name;
    const user_id_q = await db.query(
      "SELECT user_id FROM users WHERE nickname = :nickname",
      {
        type: QueryTypes.SELECT,
        replacements: { nickname }
      }
    );
    const give_user_id = user_id_q[0].user_id;
    const { get_nickname, isbn } = req.body;
    try {
      const exchange_date = new Date();
      const book_id = await db.query(
        'SELECT book_id FROM book WHERE isbn = :book_isbn',
        {
          type: QueryTypes.SELECT,
          replacements: {book_isbn: isbn}
        }
      );
      const bookId = book_id[0]?.book_id;
      const get_user_id_q = await db.query(
        'SELECT user_id FROM users WHERE nickname = :nick',
        {
          type: QueryTypes.SELECT,
          replacements: {nick: get_nickname}
        }
      );
      const get_user_id = get_user_id_q[0]?.user_id;
      await db.query(
        `
        INSERT INTO
        exchange(book_id, give_user_id, get_user_id, exchange_date)
        VALUES (:bookId, :give_user_id, :get_user_id, :exchange_date)
        `, 
        {
          type: QueryTypes.INSERT,
          replacements: {bookId, give_user_id, get_user_id, exchange_date}
        }
      );
      res.status(200).send("Exchange added sucessfully");
    } catch (error) {
      console.error('Error adding exchange:', error);
      res.status(500).json({ error: 'Failed to add exchange' });
    }
  },
  async findExchange(req, res) {
    const nickname = req.user.name;
    const user_id_q = await db.query(
      "SELECT user_id FROM users WHERE nickname = :nickname",
      {
          type: QueryTypes.SELECT,
          replacements: { nickname }
      }
    );
    const user_id = user_id_q[0].user_id;
    try {
      const available_exchanges = await db.query(
        `
        select * from (WITH my_wanted_books AS (
    SELECT book_id
    FROM wanted
    WHERE user_id = 1
),
my_ownership_books AS (
    SELECT book_id
    FROM ownership
    WHERE user_id = 1
),
users_wanted_books AS (
    SELECT w.user_id, b.book_id, b.title
    FROM wanted w
    JOIN book b ON w.book_id = b.book_id
    WHERE w.user_id != 1
),
users_ownership_books AS (
    SELECT o.user_id, b.book_id, b.title
    FROM ownership o
    JOIN book b ON o.book_id = b.book_id
    WHERE o.user_id != 1
)
SELECT 
    u.nickname,
    c.city_name,
    ctr.country_name,
    u.email,
    u.exchange_count,
    STRING_AGG(DISTINCT give_books.title, ', ') AS books_i_can_give,
    STRING_AGG(DISTINCT receive_books.title, ', ') AS books_i_can_receive
FROM users u
LEFT JOIN city c ON u.city_id = c.city_id
LEFT JOIN country ctr ON c.country_id = ctr.country_id
LEFT JOIN users_wanted_books uwb ON u.user_id = uwb.user_id
LEFT JOIN users_ownership_books uob ON u.user_id = uob.user_id
LEFT JOIN my_ownership_books mob ON uwb.book_id = mob.book_id
LEFT JOIN my_wanted_books mwb ON uob.book_id = mwb.book_id
LEFT JOIN book give_books ON mob.book_id = give_books.book_id
LEFT JOIN book receive_books ON mwb.book_id = receive_books.book_id
WHERE u.user_id != 1
GROUP BY u.user_id, c.city_name, ctr.country_name, u.email, u.exchange_count
ORDER BY u.nickname) as exchange where books_i_can_give is not null or books_i_can_receive is not null
        `,
        {
          type: QueryTypes.RAW,
          replacements: {my_user_id: user_id}
        }
      );
      res.status(200).json(available_exchanges)
    } catch (error) {
      console.log('Error finding exchanges', error)
      res.status(500).json({ error: 'Failed to find exchanges' });
    }
  },
  async findExchangeWanted(req, res) {
    const nickname = req.user.name;
    const user_id_q = await db.query(
        "SELECT user_id FROM users WHERE nickname = :nickname",
        {
            type: QueryTypes.SELECT,
            replacements: { nickname }
        }
    );
    const user_id = user_id_q[0].user_id;
    try {
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
          replacements: {user_id: user_id}
        }
      );
      res.status(200).json(exchanges_wanted);
    } catch (error) {
      console.error('Error finding exchanges:', error);
      res.status(500).json({ error: 'Failed to find exchanges' });
    }
  },
  async findExchangeOwned(req, res) {
    const nickname = req.user.name;
    const user_id_q = await db.query(
        "SELECT user_id FROM users WHERE nickname = :nickname",
        {
            type: QueryTypes.SELECT,
            replacements: { nickname }
        }
    );
    const user_id = user_id_q[0].user_id;
    try {
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
        WHERE user_id = :userId
        `,
      {
        type: QueryTypes.SELECT,
        replacements: {userId: user_id}
      });
      res.status(200).json(exchanges_owned);
    } catch (error) {
      console.error('Error finding exchanges:', error);
      res.status(500).json({ error: 'Failed to find exchanges' });
    }
  }
};

module.exports = ExchangeController;
