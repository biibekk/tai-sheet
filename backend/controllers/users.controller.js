const pool = require("../db/pool")

exports.getAllusers = async (req,res) => {
    try{
        const result = await pool.query(
            "select * from users"
        );

        res.status(200).json(result.rows)
    } catch(error) {
        console.error("Error fetching users: ",error);
        res.status(500).json({error : "Failed to fetch users"});
    }
};