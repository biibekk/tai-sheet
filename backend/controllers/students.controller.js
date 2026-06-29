const pool = require("../db/pool")

exports.getAllStudents = async (req, res) => {
    try {
        let result;
        if (req.user.role === "ADMIN") {
            result = await pool.query(
                "SELECT *, first_name || ' ' || COALESCE(last_name, '') AS name FROM students"
            );
        } else if (req.user.role === "INSTRUCTOR") {
            result = await pool.query(
                `SELECT s.*, s.first_name || ' ' || COALESCE(s.last_name, '') AS name 
                 FROM students s
                 JOIN instructors i ON s.instructor_id = i.id
                 WHERE i.user_id = $1`,
                [req.user.id]
            );
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized role" });
        }

        res.status(200).json({ success: true, message: result.rows });
    } catch (error) {
        console.error("Error fetching students: ", error);
        res.status(500).json({ success: false, message: "Failed to fetch students" });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, dob, gender, belt, weight, experience, status } = req.body;

        // Fetch instructor details to get instructor_id and dojo_id
        const instRes = await pool.query(
            "SELECT id, dojo_id FROM instructors WHERE user_id = $1",
            [req.user.id]
        );

        if (instRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Instructor profile not found" });
        }

        const instructor = instRes.rows[0];

        // Process name into first_name and last_name
        const nameParts = name.trim().split(/\s+/);
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(" ") || null;

        // Map values to DB schema constraints and Enums
        const dbGender = gender.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE";
        const dbExperience = experience === "Beginner" ? "FRESHER" : "EXPERIENCED";
        const dbBelt = belt.toUpperCase();
        const isActive = status !== "Inactive";

        // Insert into database conforming to schema.sql
        const insertRes = await pool.query(
            `INSERT INTO students (
                first_name, 
                last_name, 
                date_of_birth, 
                gender, 
                current_belt, 
                current_weight, 
                fight_experience, 
                instructor_id, 
                dojo_id,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                first_name,
                last_name,
                dob,
                dbGender,
                dbBelt,
                weight ? parseFloat(weight) : null,
                dbExperience,
                instructor.id,
                instructor.dojo_id,
                isActive
            ]
        );

        res.status(201).json({ success: true, message: "Student created successfully", student: insertRes.rows[0] });
    } catch (error) {
        console.error("Error creating student: ", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create student" });
    }
};