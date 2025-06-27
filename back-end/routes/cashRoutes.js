const {
    createCashItem,
    getAllCashItem
} = require("../controller/cashController");
const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
router.post("/cash", verifyToken, createCashItem);
router.get("/cash", verifyToken, getAllCashItem);
module.exports = router;