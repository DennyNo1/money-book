const { verifyToken } = require("../middleware/authMiddleware");
const { importExpenseTwoRecords, getExpenseTwoByMonth } = require("../controller/expenseTwoController");
const express = require("express");
const router = express.Router();
router.post("/expenseTwo", verifyToken, importExpenseTwoRecords);
router.get("/expenseTwo", verifyToken, getExpenseTwoByMonth);
module.exports = router;