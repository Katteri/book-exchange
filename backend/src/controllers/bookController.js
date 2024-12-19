const { QueryTypes } = require('sequelize');
const db = require("../config/db");

const BookController = {
    async getBookInfo(req, res) {
        const { isbn } = req.params;
        try {
            const book = await db.query(
                "SELECT * FROM get_book_info(:isbn)",
                {
                    type: QueryTypes.SELECT,
                    replacements: { isbn }
                }
            );
            res.status(200).json(book);
        } catch (error) {
            console.error('Error finding book:', error);
            res.status(500).json({ error: 'Failed to '});
        }
    }
};

module.exports = BookController;