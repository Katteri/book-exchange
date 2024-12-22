require('dotenv').config();
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require('jsonwebtoken');

const AuthController = {
  async signup(req, res) {
    const { nickname, first_name, last_name, country_name, city_name, email, password } = req.body;
    try {
      const existingUser = await db.query(
        "SELECT user_id FROM users WHERE nickname = :nickname",
        {
          type: QueryTypes.SELECT,
          replacements: { nickname },
        }
      );
      if (existingUser.length > 0) {
        return res.status(409).send("User with such nickname already exists");
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const finding_country = await db.query( // вытягиваем айди страны по имени
        "SELECT country_id FROM country WHERE country_name = :country_name",
        {
          type: QueryTypes.SELECT,
          replacements: { country_name }
        }
      );
      if (finding_country.length === 0) { // если страны не нашлось
        await db.query( // добавляем страну
          "INSERT INTO country (country_name) VALUES (:country_name)",
          {
            type: QueryTypes.INSERT,
            replacements: { country_name }
          }
        )
      }
      const country_id_q = await db.query( // вытягиваем айди страны
        "SELECT country_id FROM country WHERE country_name = :country_name",
        {
          type: QueryTypes.SELECT,
          replacements: { country_name }
        }
      )
      const country_id = country_id_q[0].country_id // берем айди страны

      const finding_city = await db.query( // ищем город в такой стране
        `SELECT city_id 
        FROM city 
        WHERE city_name = :city_name AND country_id = :country_id`,
        {
          type: QueryTypes.SELECT,
          replacements: { city_name, country_id }
        }
      )
      if (finding_city.length === 0) { // если не нашлось города
        await db.query( // создаем его
          "INSERT INTO city (city_name, country_id) VALUES (:city_name, :country_id)",
          {
            type: QueryTypes.INSERT,
            replacements: { city_name, country_id }
          }
        )
      }
      const city_id_q = await db.query( // вытягиваем айди города
        "SELECT city_id FROM city WHERE city_name = :city_name AND country_id = :country_id",
        {
          type: QueryTypes.SELECT,
          replacements: { city_name }
        }
      )
      const city_id = city_id_q[0].city_id // достаем айди города
      await db.query( // добавлямем юзера
        `
        INSERT INTO users (nickname, first_name, last_name, city_id, country_id, email)
        VALUES (:nickname, :first_name, :last_name, :city_id, :country_id, :email)
        `,
        {
          type: QueryTypes.INSERT,
          replacements: { nickname, first_name, last_name, city_id, country_id, email },
        }
      );
      const userIdResult = await db.query( // берем айди добавленного юзера по введенному нику
        "SELECT user_id from users WHERE nickname = :nickname",
        {
          type: QueryTypes.SELECT,
          replacements: { nickname }
        }
      );
      const user_id = userIdResult[0].user_id; // айди юзера
      await db.query( // добавляем пароль
        `
        INSERT INTO passwd (user_id, password_hash)
        VALUES (:user_id, :hashedPassword)
        `,
        {
          type: QueryTypes.INSERT,
          replacements: { user_id, hashedPassword }
        }
      );
      return res.status(201).send("User signed up successfully!");
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("An error occured during signup");
  }},
  async login(req, res) {
    try {
      const { nickname, password } = req.body;
      const userResult = await db.query(
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

      if (userResult.length === 0) {
        return res.status(404).send("Username cannot be found");
      }

      const passwordHash = userResult[0].password_hash;
      const isPasswordsMatch = await bcrypt.compare(password, passwordHash);

      if (isPasswordsMatch) {
        const accessToken = jwt.sign(
          { name: nickname },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: "1h" }
        );
        console.log("Login successfull")

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
