const { createInvestItem, getInvestItem, makeInvest, getInvestmentHistory, deleteInvestItem, checkDuplicateInvestment } = require("../controller/investController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/invest", verifyToken, createInvestItem);
router.get("/invest", verifyToken, getInvestItem);
router.post("/invest/make", verifyToken, makeInvest);
router.get("/invest/check-duplicate", verifyToken, checkDuplicateInvestment)
// 如果只查询id，就用路径参数path parameter
// ✅ Parameterized routes come AFTER specific routes
router.get("/invest/:itemId", verifyToken, getInvestmentHistory)
router.delete("/invest/:itemId", verifyToken, deleteInvestItem);


// 在 Express.js 中，router 定义时只需要写路径参数，body 和查询参数都在控制器函数中通过 req 对象获取。
module.exports = router;