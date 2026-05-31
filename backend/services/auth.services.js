const pool = require('../db/pool');
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require('jsonwebtoken');


class AuthService {
    async login({ email, password }) {
        const sql = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(sql, [email]);
        const user = result.rows[0];
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const validpswd = await bcrypt.compare(
            password,
            user.password_hash
        )
        if (!validpswd) {
            throw new Error("Invalid credentials")
        }

        // signed token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    };
}

module.exports = new AuthService();