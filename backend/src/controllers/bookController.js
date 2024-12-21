const { QueryTypes, json } = require('sequelize');
const db = require("../config/db");

const BookController = {
    async getWantedBooks(req, res) {
        const { user_id } = req.params.user_id;
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
                WHERE w.user_id = :u_id
                `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { u_id: user_id }
                }
            );
            res.status(200).json(wanted_books);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to find wanted books'});
        };
    },
    async getOwnedBooks(req, res) {
        const { user_id } = req.params.user_id;
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
                WHERE o.user_id = :u_id
                `,
                {
                    type: QueryTypes.SELECT,
                    replacements: {u_id: user_id}
                }
            );
            res.status(200).json(owned_books);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to find owned books'});
        }
    },
    async addBookToWanted(req, res) {
        const { user_id, isbn, title, first_name, middle_name, last_name, category, publish_date, language, book_series } = req.body;
        try {
            const isbn_exists = await db.query(
                "SELECT book_id FROM book WHERE isbn = :book_isbn",
            {
                type: QueryTypes.SELECT,
                replacements: {book_isbn: isbn}
            });
            if (isbn_exists.length === 0) {
                const jsonData = JSON.stringify([{
                    isbn, title, first_name, middle_name, last_name, category, publish_date, language, book_series
                }])
                await db.query("CALL add_books_bulk(:json_data)",
                    {
                        type: QueryTypes.RAW,
                        replacements: {json_data: jsonData}
                    }
                )
            };
            const bookId = isbn_exists[0]?.book_id;
            await db.query(
                "INSERT INTO wanted (user_id, book_id) VALUES (:userid, :bookid)",
                {
                    type: QueryTypes.INSERT,
                    replacements: {userid: user_id, bookid: bookId}
                }
            );
            res.status(200).send("Book successfully added to wanted list");
        } catch (error) {
            console.error('Error adding book to wanted list:', error);
            res.status(500).json({ error: 'Failed to add book'});
        }
    },
    async addBookToOwned(req, res) {
        const { user_id, isbn, title, first_name, middle_name, last_name, category, publish_date, language, book_series, condition } = req.body;
        try {
            const isbn_exists = await db.query(
                "SELECT book_id FROM book WHERE isbn = :book_isbn",
            {
                type: QueryTypes.SELECT,
                replacements: {book_isbn: isbn}
            });
            if (!isbn_exists) {
                const jsonData = JSON.stringify([{
                    isbn, title, first_name, middle_name, last_name, category, publish_date, language, book_series
                }])
                await db.query("CALL add_books_bulk(:json_data::JSONB)",
                    {
                        type: QueryTypes.RAW,
                        replacements: {json_data: jsonData}
                    }
                )
            };
            const bookId = await db.query(
                "SELECT book_id FROM book WHERE isbn = :book_isbn",
                {
                    type: QueryTypes.SELECT,
                    replacements: {book_isbn: isbn}
                }
            );
            await db.query(
                "INSERT INTO ownership (user_id, book_id, condition) VALUES (:u_id, :b_id, :condition)",
                {
                    type: QueryTypes.INSERT,
                    replacements: {u_id: user_id, b_id: bookId, condition: condition}
                }
            );
            res.status(200).send("Book successfully added to ownership list");
        } catch (error) {
            console.error('Error adding book to ownership list:', error);
            res.status(500).json({ error: 'Failed to add book'});
        }
    },
    async deleteBookFromWanted(req, res) {
        const { user_id, isbn } = req.body;
        try {
            const book = await db.query(
                "SELECT book_id FROM book WHERE isbn = :book_isbn",
                {
                    type: QueryTypes.SELECT,
                    replacements: {book_isbn: isbn}
                }
            );
            console.log(book)
            if (!book) {
                return res.status(404).json({error: "Book not found"});
            }
            const bookId = book[0].book_id;
            const result = await db.query(
                "DELETE FROM wanted WHERE user_id = :u_id AND book_id = :book_id",
                {
                    type: QueryTypes.DELETE,
                    replacements: {u_id: user_id, book_id: bookId}
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
        const { user_id, isbn } = req.body;
        try {
            const book = await db.query(
                "SELECT book_id FROM book WHERE isbn = :book_isbn",
                {
                    type: QueryTypes.SELECT,
                    replacements: {book_isbn: isbn}
                }
            );
            if (!book) {
                return res.status(404).json({error: "Book not found"});
            }
            const bookId = book[0].book_id;
            const result = await db.query(
                "DELETE FROM ownership WHERE user_id = :u_id AND book_id = :book_id",
                {
                    type: QueryTypes.DELETE,
                    replacements: {u_id: user_id, book_id: bookId}
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