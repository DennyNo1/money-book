const { createInvestItem, getInvestItem, makeInvest, getInvestmentHistory } = require("../controller/investController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/invest", verifyToken, createInvestItem);
router.get("/invest", verifyToken, getInvestItem);
router.post("/invest/make", verifyToken, makeInvest);
// 如果只查询id，就用路径参数path parameter
router.get("/invest/:itemId", verifyToken, getInvestmentHistory)
module.exports = router;