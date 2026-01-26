const express = require("express");
const router = express.Router();

const { getAllTournaments} = require("../controllers/tournaments.controller");

router.get("/", getAllTournaments);

module.exports = router;
