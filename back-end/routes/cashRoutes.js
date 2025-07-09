const {
    createCashItem,
    getAllCashItem,
    deleteCashItem
} = require("../controller/cashController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/cash", verifyToken, createCashItem);
router.get("/cash", verifyToken, getAllCashItem);
router.delete("/cash/:_id", verifyToken, deleteCashItem);  // 软删除

module.exports = router;