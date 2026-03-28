const pool = require("../db/pool")

exports.getAllStudents = async (req,res) => {
    try{
        const result = await pool.query(
            "SELECT * FROM students"
        );

        res.status(200).json(result.rows);
    } catch(error) {
        console.error("Error fetching students: ",error);
        res.status(500).json({error : "Failed to fetch students"});
    }
};