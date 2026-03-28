const express = require("express");
const router = express.Router();

// importing tournament controller function
const { getAllTournaments} = require("../controllers/tournaments.controller");

// defining routes
router.get("/", getAllTournaments);

module.exports = router;
