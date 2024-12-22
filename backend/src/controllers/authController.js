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
      const transaction = await db.transaction();
      try {
        const country = await db.query(
          `
          INSERT INTO country (country_name)
          VALUES (:country)
          ON CONFLICT (country_name) DO NOTHING
          RETURNING country_id
          `,
          {
            type: QueryTypes.INSERT,
            replacements: { country: country_name},
            transaction
          }
        );
        const countryId = country[0]?.country_id || 
        (await db.query(
          "SELECT country_id FROM country where country_name = :country",
          {
            type: QueryTypes.SELECT,
            replacements: {country: country_name},
            transaction
          }
        ))[0]?.country_id;
        const city = await db.query(
          `
          INSERT INTO city (city_name, country_id)
          VALUES (:ci_name, :co_id)
          
          RETURNING city_id
          `,
          {
            type: QueryTypes.INSERT,
            replacements: { ci_name: city_name, co_id: countryId},
            transaction
          }
        );
        const cityId = city[0]?.city_id ||
        (await db.query(
          "SELECT city_id FROM city WHERE city_name = :ci_name AND country_id = :country_id",
          {
            type: QueryTypes.SELECT,
            replacements: {ci_name: city_name, country_id: countryId},
            transaction
          }
        ))[0]?.city_id;
        const user = await db.query(
          `
          INSERT INTO users (nickname, first_name, last_name, city_id, country_id, email)
          VALUES (:nick, :f_name, :l_name, :ci_id, :co_id, :e_mail)
          RETURNING user_id
          `,
          {
            type: QueryTypes.INSERT,
            replacements: {
            nick: nickname,
            f_name: first_name,
            l_name: last_name,
            ci_id: cityId,
            co_id: countryId,
            e_mail: email
          },
          transaction
        }
      );
      const userId = user[0]?.user_id;
      await db.query(
        `
        INSERT INTO passwd(user_id, password_hash) 
        VALUES (:usr_id, :hashed_password)
        `,
        {
          type: QueryTypes.INSERT,
          replacements: {usr_id: userId, hashed_password: hashedPassword},
          transaction
        }
      );
      await transaction.commit();
      return res.status(201).send("User signed up successfully!");
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
