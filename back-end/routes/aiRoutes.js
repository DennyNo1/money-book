const express = require("express");
const { categorizeWechatRecordWithAI } = require("../controller/aiController");
const router = express.Router();
router.post("/ai/wechat", categorizeWechatRecordWithAI);
module.exports = router;