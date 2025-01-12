const {
  addCalculateTable,
  getCalculateTable,
} = require("../controller/calculateController");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
router.post("/book/calculate", verifyToken, addCalculateTable);
router.get("/book/calculate", verifyToken, getCalculateTable);
module.exports = router;
