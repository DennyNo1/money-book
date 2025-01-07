const { addDoc, getAllDocs } = require("../controller/codeController");
const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/code/doc", verifyToken, addDoc);
router.get("/code/docs", verifyToken, getAllDocs);
module.exports = router;
