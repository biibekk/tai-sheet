const express = require("express")
const router = express.Router()

const {getAllStudents} = require("../controllers/students.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.get("/",authMiddleware.verifyToken,authMiddleware.restrictTo("ADMIN"), getAllStudents)

module.exports = router