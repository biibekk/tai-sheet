const pool = require("../db/pool")

exports.getAllStudents = async (req,res) => {
    try{
        const result = await pool.query(
            "SELECT * FROM students"
        );

        res.status(200).json({success: true, message: result.rows});
    } catch(error) {
        console.error("Error fetching students: ",error);
        res.status(500).json({success: false, message: "Failed to fetch students"});
    }
};