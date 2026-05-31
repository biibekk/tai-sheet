const express = require('express')
const router = express.Router()

const {getAllusers} = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// pass it through middleware to check if user is logged in
router.get('/',authMiddleware.verifyToken, getAllusers)

module.exports = router;