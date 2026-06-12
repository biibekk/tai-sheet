const pool = require("../db/pool");

class AdminController {
    async fetchPendingUsers(req, res) {
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

    async getStats(req, res) {
        try {
            const sql = `SELECT 
                COUNT(id) as total_tournaments,
                COUNT(CASE WHEN status = 'ONGOING' THEN 1 END) as active_tournaments,
                COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as upcoming_tournaments
            FROM tournaments`;
            const result = await pool.query(sql);
            // console.log(result)
            // console.log(result.rows[0])
            res.status(200).json({
                success: true,
                // stats: result.rows[0]
                stats: {
                    totalTournaments: result.rows[0].total_tournaments,
                    registeredParticipants: 0, // TODO: fetch from database
                    matchesScheduled: 0, // TODO: fetch from database
                    // pendingApprovals: 0, // TODO: fetch from database
                    activeTournaments: result.rows[0].active_tournaments,
                    upcomingTournaments: result.rows[0].upcoming_tournaments
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to fetch stats"
            });
        }
    }
}

module.exports = new AdminController();
