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

    async register(data) {
        console.log(data);
        // return {
        //     success: true,
        //     message: "User registered successfully"
        // };
        const { fullName, email, phone, beltRank, academyName, city, password, confirmPassword } = data;
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (phone.length !== 10) {
            throw new Error("Invalid phone number");
        }
        const emailcheck = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const usercheck = emailcheck.rows[0];
        if (usercheck) {
            throw new Error("Email already exists");
        }

        const pswdhash = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users(name, email, phone, password_hash, role)
        VALUES ($1, $2, $3, $4, 'INSTRUCTOR')`

        await pool.query(sql, [fullName, email, phone, pswdhash])

        return {
            success: true,
            message: "User registered successfully"
        }
    };
}

module.exports = new AuthService();