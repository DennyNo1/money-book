const { verifyToken } = require("../middleware/authMiddleware");
const { postAliRecords, postWechatRecords, getExpenseTwoByMonth } = require("../controller/expenseTwoController");
const express = require("express");
const router = express.Router();
router.post("/expenseTwo/ali", verifyToken, postAliRecords);
router.post("/expenseTwo/wechat", verifyToken, postWechatRecords);
router.get("/expenseTwo", verifyToken, getExpenseTwoByMonth);
module.exports = router;