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
            const { email, approval_status } = req.body;

            // Update user status
            const updateSql = `UPDATE users
                               SET approval_status = $1
                               WHERE email = $2
                               RETURNING id, name, role, belt_rank, academy_name, city`;
            const result = await pool.query(updateSql, [approval_status, email]);

            if (result.rows.length > 0 && approval_status === "APPROVED") {
                const user = result.rows[0];

                if (user.role === "INSTRUCTOR") {
                    // Check if instructor profile already exists to prevent duplicate entries
                    const instructorCheck = await pool.query(
                        "SELECT id FROM instructors WHERE user_id = $1",
                        [user.id]
                    );

                    if (instructorCheck.rows.length === 0) {
                        // Create dojo entry first
                        const dojoName = user.academy_name || "Tiger TKD Dojo";
                        const dojoCity = user.city || "Kathmandu";
                        const dojoRes = await pool.query(
                            `INSERT INTO dojos (name, city, owner_id)
                             VALUES ($1, $2, $3)
                             RETURNING id`,
                            [dojoName, dojoCity, user.id]
                        );
                        const dojoId = dojoRes.rows[0].id;

                        // Create instructor entry
                        const beltRank = user.belt_rank || "BLACK";
                        await pool.query(
                            `INSERT INTO instructors (user_id, dojo_id, belt_rank)
                             VALUES ($1, $2, $3)`,
                            [user.id, dojoId, beltRank]
                        );
                        console.log(`Dojo & Instructor created successfully for user ${user.name}`);
                    }
                }
            }

            res.status(200).json({
                success: true,
                message: `User ${approval_status.toLowerCase()} successfully`
            });
        } catch (error) {
            console.error("Error in approveOrReject:", error);
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
