const express = require("express")
const router = express.Router()

const {getAllStudents} = require("../controllers/students.controller")

router.get("/",getAllStudents)

module.exports = router