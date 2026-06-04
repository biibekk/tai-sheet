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

    async approveOrReject(req, res) {
        try {
            const sql = `UPDATE users
                    SET approval_status = $1
                    WHERE email = $2`
            const { email, approval_status } = req.body;

            // console.log(email, approval_status);

            const response = await pool.query(sql, [approval_status, email]);
            // console.log(response)
            // const data = response.rows; - empty
            // console.log(data);
            res.status(200).json({
                success: true,
                message: `User ${approval_status.toLowerCase()} successfully`
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: `Failed to update user status`
            });
        }
    }
}

module.exports = new AdminController();
