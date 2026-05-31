const pool = require("../db/pool");

exports.getAllTournaments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, start_date, end_date, registration_deadline,status,created_by,created_at FROM tournaments ORDER BY start_date DESC"
    );
    // console.log(result);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
};
