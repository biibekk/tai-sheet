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

        if(user.approval_status === 'PENDING'){
            throw new Error("Account Approval Pending")
        }
        else if(user.approval_status === 'REJECTED'){
            throw new Error("Account Rejected")
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
                name: user.name,
            },
        };
    };

    async register(data) {
        // console.log(data);
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

        const sql = `INSERT INTO users(name, email, phone, password_hash, role, belt_rank, academy_name, city)
        VALUES ($1, $2, $3, $4, 'INSTRUCTOR', $5, $6, $7)`

        await pool.query(sql, [fullName, email, phone, pswdhash, beltRank, academyName, city])

        return {
            success: true,
            message: "User registered successfully"
        }
    };
}

module.exports = new AuthService();