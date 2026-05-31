// Create a route object
const express = require("express")
const router = express.Router()
const drawController = require("../controllers/draw.controller")

router.post("/categories/:categoryId/generate-draw", drawController.generateDraw);

module.exports = router;