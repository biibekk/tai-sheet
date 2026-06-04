const pool = require("../db/pool");

class AdminController {
    async adminApproval(req, res) {
        try {
            const sql = `SELECT * FROM users WHERE approval_status = 'PENDING'`;
            const result = await pool.query(sql);
            // console.log(result.rows);
            res.status(200).json({
                success: true,
                users: result.rows
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to fetch users",
            });
        }
    }
}

module.exports = new AdminController();

    