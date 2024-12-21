const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require('jsonwebtoken');

const AuthController = {
  async signup(req, res) {
    const { nickname, email, first_name, last_name, city_id, country_id, password } = req.body;
    try {
      const existingUser = await db.query(
        "SELECT user_id FROM users WHERE nickname = :nick",
        {
          type: QueryTypes.SELECT,
          replacements: { nick: nickname },
        }
      );

      if (existingUser.length > 0) {
        return res.status(409).send("User with such nickname already exists");
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await db.query(
        `
        INSERT INTO users (nickname, first_name, last_name, city_id, country_id, email)
        VALUES (:nick, :f_name, :l_name, :ci_id, :co_id, :e_mail)
        `,
        {
          type: QueryTypes.INSERT,
          replacements: { nick: nickname, f_name: first_name, l_name: last_name, ci_id: city_id, co_id: country_id, e_mail: email },
        }
      );
      const userIdResult = await db.query(
        "SELECT user_id FROM users WHERE nickname = :nick",
        {
          type: QueryTypes.SELECT,
          replacements: { nick: nickname },
        }
      );
      const user_id = userIdResult[0]?.user_id;
      await db.query(
        `
        INSERT INTO passwd (user_id, password_hash) 
        VALUES (:u_id, :pass)
        `,
        {
          type: QueryTypes.INSERT,
          replacements: { u_id: user_id, pass: hashedPassword },
        }
      );

      return res.status(201).send("User signed up successfully!");
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).send("An error occurred during signup.");
    }
  },
  async login(req, res) {
    try {
      const { nickname, password } = req.body;
      const user = await db.query(
        `
        SELECT password_hash 
        FROM passwd 
        JOIN users ON passwd.user_id = users.user_id 
        WHERE nickname = :nick
        `,
        {
          type: QueryTypes.SELECT,
          replacements: { nick: nickname },
        }
      );

      if (user.length === 0) {
        return res.status(404).send("Username cannot be found");
      }

      const passwordHash = user[0].password_hash;
      const isPasswordsMatch = await bcrypt.compare(password, passwordHash);

      if (isPasswordsMatch) {
        const accessToken = jwt.sign(
          { name: nickname },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        return res.json({ accessToken });
      } else {
        return res.status(401).send("Wrong password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send("An error occurred during login.");
    }
  },
};

module.exports = AuthController;
