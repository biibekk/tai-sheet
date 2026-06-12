const express = require("express");
const router = express.Router();

// importing tournament controller function
const { getAllTournaments, createTournament } = require("../controllers/tournaments.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// defining routes
router.get("/", getAllTournaments);
router.post("/", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), createTournament);

module.exports = router;
