const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/fetch-pending", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), adminController.adminApproval);

router.put("/approval", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), adminController.approveOrReject);
module.exports = router;