const pool = require("../db/pool");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories"
    );
    // console.log(result);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
