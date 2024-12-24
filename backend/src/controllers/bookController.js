require('dotenv').config();
const { QueryTypes, json } = require('sequelize');
const db = require("../config/db");

const BookController = {
    async getMyWantedBooks(req, res) {
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
            const wanted_books = await db.query(
                `SELECT
                    w.book_id,
                    b.isbn,
                    gbi.title,
                    gbi.author_name,
                    gbi.category_name,
                    gbi.publish_date,
                    gbi.language,
                    gbi.series_name
                FROM wanted w
                LEFT JOIN book b ON b.book_id = w.book_id
                LEFT JOIN LATERAL get_book_info(b.isbn) gbi ON TRUE
                WHERE w.user_id = :user_id
                `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { user_id }
                }
            );
            res.status(200).json(wanted_books);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to find wanted books'});
        };
    },
    async getMyOwnedBooks(req, res) {
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
            const owned_books = await db.query(
                `
                SELECT
                    o.book_id,
                    b.isbn,
                    gbi.title,
                    gbi.author_name,
                    o.condition,
                    gbi.category_name,
                    gbi.publish_date,
                    gbi.language,
                    gbi.series_name
                FROM ownership o
                LEFT JOIN book b ON b.book_id = o.book_id
                LEFT JOIN LATERAL get_book_info(b.isbn) gbi ON TRUE
                WHERE o.user_id = :user_id
                `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { user_id }
                }
            );
            res.status(200).json(owned_books);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to find owned books'});
        }
    },
    async getWantedBooks(req, res) {
        const nickname = req.params.nickname;
        const user_id_q = await db.query(
            "SELECT user_id FROM users WHERE nickname = :nickname",
            {
                type: QueryTypes.SELECT,
                replacements: { nickname }
            }
        );
        const user_id = user_id_q[0].user_id;
        try {
            const wanted_books = await db.query(
                `SELECT
                    w.book_id,
                    b.isbn,
                    gbi.title,
                    gbi.author_name,
                    gbi.category_name,
                    gbi.publish_date,
                    gbi.language,
                    gbi.series_name
                FROM wanted w
                LEFT JOIN book b ON b.book_id = w.book_id
                LEFT JOIN LATERAL get_book_info(b.isbn) gbi ON TRUE
                WHERE w.user_id = :user_id
                `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { user_id }
                }
            );
            res.status(200).json(wanted_books);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to find wanted books'});
        };
    },
    async getOwnedBooks(req, res) {
        const nickname = req.params.nickname;
        const user_id_q = await db.query(
            "SELECT user_id FROM users WHERE nickname = :nickname",
            {
                type: QueryTypes.SELECT,
                replacements: { nickname }
            }
        );
        const user_id = user_id_q[0].user_id;
        try {
            const owned_books = await db.query(
                `
                SELECT
                    o.book_id,
                    b.isbn,
                    gbi.title,
                    gbi.author_name,
                    o.condition,
                    gbi.category_name,
                    gbi.publish_date,
                    gbi.language,
                    gbi.series_name
                FROM ownership o
                LEFT JOIN book b ON b.book_id = o.book_id
                LEFT JOIN LATERAL get_book_info(b.isbn) gbi ON TRUE
                WHERE o.user_id = :user_id
                `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { user_id }
                }
            );
            res.status(200).json(owned_books);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to find owned books'});
        }
    },
    async addBookToWanted(req, res) {
        const nickname = req.user.name;
        const user_id_q = await db.query(
            "SELECT user_id FROM users WHERE nickname = :nickname",
            {
                type: QueryTypes.SELECT,
                replacements: { nickname }
            }
        );
        const user_id = user_id_q[0].user_id;
        const { isbn, title, language, publish_date, category, book_series, first_name, middle_name, last_name } = req.body;
        try {
            const isbn_exists = await db.query(
                "SELECT book_id FROM book WHERE isbn = :isbn",
            {
                type: QueryTypes.SELECT,
                replacements: {isbn}
            });
            if (isbn_exists.length === 0) {
                const jsonData = JSON.stringify([{
                    isbn, title, first_name, middle_name, last_name, category, publish_date, language, book_series
                }])
                await db.query("CALL add_books_bulk(:jsonData)",
                    {
                        type: QueryTypes.RAW,
                        replacements: { jsonData }
                    }
                )
            };
            const book_id_q = await db.query(
                "SELECT book_id FROM book WHERE isbn = :isbn",
            {
                type: QueryTypes.SELECT,
                replacements: { isbn }
            });
            const bookId = book_id_q[0]?.book_id;
            await db.query(
                "INSERT INTO wanted (user_id, book_id) VALUES (:user_id, :bookId)",
                {
                    type: QueryTypes.INSERT,
                    replacements: {user_id, bookId}
                }
            );
            res.status(200).send("Book successfully added to wanted list");
        } catch (error) {
            console.error('Error adding book to wanted list:', error);
            res.status(500).json({ error: 'Failed to add book'});
        }
    },
    async addBookToOwned(req, res) {
        const nickname = req.user.name;
        const user_id_q = await db.query(
            "SELECT user_id FROM users WHERE nickname = :nickname",
            {
                type: QueryTypes.SELECT,
                replacements: { nickname }
            }
        );
        const user_id = user_id_q[0].user_id;
        const { isbn, title, language, publish_date, condition, category, book_series, first_name, middle_name, last_name } = req.body;
        try {
            const isbn_exists = await db.query(
                "SELECT book_id FROM book WHERE isbn = :isbn",
            {
                type: QueryTypes.SELECT,
                replacements: { isbn }
            });
            if (isbn_exists.length === 0) {
                const jsonData = JSON.stringify([{
                    isbn, title, first_name, middle_name, last_name, category, publish_date, language, book_series, condition
                }])
                await db.query("CALL add_books_bulk(:jsonData)",
                    {
                        type: QueryTypes.RAW,
                        replacements: { jsonData }
                    }
                )
            };
            const book_id_q = await db.query(
                "SELECT book_id FROM book WHERE isbn = :isbn",
            {
                type: QueryTypes.SELECT,
                replacements: { isbn }
            });
            const bookId = book_id_q[0]?.book_id;
            await db.query(
                "INSERT INTO ownership (user_id, book_id, condition) VALUES (:user_id, :bookId, :condition)",
                {
                    type: QueryTypes.INSERT,
                    replacements: { user_id, bookId, condition}
                }
            );
            res.status(200).send("Book successfully added to ownership list");
        } catch (error) {
            console.error('Error adding book to ownership list:', error);
            res.status(500).json({ error: 'Failed to add book'});
        }
    },
    async deleteBookFromWanted(req, res) {
        const nickname = req.user.name;
        const user_id_q = await db.query(
            "SELECT user_id FROM users WHERE nickname = :nickname",
            {
                type: QueryTypes.SELECT,
                replacements: { nickname }
            }
        );
        const user_id = user_id_q[0].user_id;
        const { isbn } = req.body;
        try {
            const book = await db.query(
                "SELECT book_id FROM book WHERE isbn = :isbn",
                {
                    type: QueryTypes.SELECT,
                    replacements: { isbn }
                }
            );
            console.log(book)
            if (book.length === 0) {
                return res.status(404).json({error: "Book not found"});
            }
            const bookId = book[0]?.book_id;
            const result = await db.query(
                "DELETE FROM wanted WHERE user_id = :user_id AND book_id = :bookId",
                {
                    type: QueryTypes.DELETE,
                    replacements: { user_id, bookId }
                }
            );
            if (result.rowCount === 0){
                return res.status(404).json({
                    error: "No entry found in wanted list"
                })
            }
            return res.status(200).json({message: "Book successfully removed"});
        } catch (error) {
            console.error('Error delete book:', error);
            res.status(500).json({ error: 'Failed to delete book'});
        }
    },
    async deleteBookFromOwned(req, res) {
        const nickname = req.user.name;
        const user_id_q = await db.query(
            "SELECT user_id FROM users WHERE nickname = :nickname",
            {
                type: QueryTypes.SELECT,
                replacements: { nickname }
            }
        );
        const user_id = user_id_q[0].user_id;
        const { isbn } = req.body;
        try {
            const book = await db.query(
                "SELECT book_id FROM book WHERE isbn = :isbn",
                {
                    type: QueryTypes.SELECT,
                    replacements: { isbn }
                }
            );
            if (!book) {
                return res.status(404).json({error: "Book not found"});
            }
            const bookId = book[0]?.book_id;
            const result = await db.query(
                "DELETE FROM ownership WHERE user_id = :user_id AND book_id = :bookId",
                {
                    type: QueryTypes.DELETE,
                    replacements: { user_id, bookId }
                }
            );
            if (result.rowCount === 0){
                return res.status(404).json({
                    error: "No entry found in wanted list"
                })
            }
            return res.status(200).json({message: "Book successfully removed"});
        } catch (error) {
            console.error('Error delete book:', error);
            res.status(500).json({ error: 'Failed to delete book'});
        }
    }
};

module.exports = BookController;
