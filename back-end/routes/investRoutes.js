const { createInvestItem } = require("../controller/investController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/invest", verifyToken, createInvestItem);
module.exports = router;