const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.error("Token not provided")
        return res.status(401).send("Access denied. No token provided")
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification error:", err.message);
            return res.status(403).json({ message: "invalid or expired token" })
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;