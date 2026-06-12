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

exports.createTournament = async (req, res) => {
  try {
    const { name, location, start_date, end_date, registration_deadline, status } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ error: "Name, start date, and end date are required" });
    }

    const finalStatus = status || 'DRAFT';
    const validStatuses = ['DRAFT', 'OPEN', 'CLOSED', 'ONGOING', 'COMPLETED'];
    if (!validStatuses.includes(finalStatus.toUpperCase())) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const createdBy = req.user ? req.user.id : null;

    const query = `
      INSERT INTO tournaments (name, location, start_date, end_date, registration_deadline, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, location, start_date, end_date, registration_deadline, status, created_by, created_at
    `;
    const values = [
      name,
      location,
      start_date,
      end_date,
      registration_deadline || null,
      finalStatus.toUpperCase(),
      createdBy
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, tournament: result.rows[0] });
  } catch (error) {
    console.error("Error creating tournament:", error);
    res.status(500).json({ error: "Failed to create tournament" });
  }
};

