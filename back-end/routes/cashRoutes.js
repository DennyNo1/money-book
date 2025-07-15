const {
    createCashItem,
    getAllCashItem,
    deleteCashItem,
    getCashHistory,
    modifyCashItem
} = require("../controller/cashController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/cash", verifyToken, createCashItem);
router.get("/cash", verifyToken, getAllCashItem);
router.delete("/cash/:_id", verifyToken, deleteCashItem);  // 软删除
router.get("/cash/history/:itemName", verifyToken, getCashHistory);
router.put("/cash/:_id", verifyToken, modifyCashItem);


module.exports = router;