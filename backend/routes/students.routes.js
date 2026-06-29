const express = require("express")
const router = express.Router()

const { getAllStudents, createStudent } = require("../controllers/students.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN", "INSTRUCTOR"), getAllStudents)
router.post("/addStudent", authMiddleware.verifyToken, authMiddleware.restrictTo("INSTRUCTOR"), createStudent)

module.exports = router