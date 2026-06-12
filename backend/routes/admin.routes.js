const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/fetch-pending", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), adminController.fetchPendingUsers);

router.put("/approval", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), adminController.approveOrReject);

router.get("/stats", authMiddleware.verifyToken, authMiddleware.restrictTo("ADMIN"), adminController.getStats);
module.exports = router;