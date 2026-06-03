const pool = require("../db/pool")

exports.getAllusers = async (req,res) => {
    try{
        const result = await pool.query(
            "select * from users"
        );
        // console.log(result)
        res.status(200).json({success: true, message: result.rows})
    } catch(error) {
        console.error("Error fetching users: ",error);
        res.status(500).json({success: false, message: error.message});
    }
};