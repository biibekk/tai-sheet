const pool = require("../db/pool");

exports.getAllTournaments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, event_date, registration_deadline,status,created_by,created_at FROM tournaments ORDER BY event_date DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
};
