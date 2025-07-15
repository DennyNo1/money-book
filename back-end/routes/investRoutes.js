const { createInvestItem, getInvestItem } = require("../controller/investController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/invest", verifyToken, createInvestItem);
router.get("/invest", verifyToken, getInvestItem);
module.exports = router;