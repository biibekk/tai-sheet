const express = require('express')
const router = express.Router()

const {getAllusers} = require("../controllers/users.controller");

router.get('/',getAllusers)

module.exports = router;