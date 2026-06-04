const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/approval", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), adminController.adminApproval);

module.exports = router;