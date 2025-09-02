const { verifyToken } = require("../middleware/authMiddleware");
const { createExpenseRecordMonthly, listExpenseRecordMonthly } = require("../controller/expenseController");
const express = require("express");
const router = express.Router();
router.post("/expense", verifyToken, createExpenseRecordMonthly);
router.get("/expense", verifyToken, listExpenseRecordMonthly);
module.exports = router;