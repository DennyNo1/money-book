const express = require("express");
const { postWechatRecords } = require("../controller/aiController");
const router = express.Router();
router.post("/ai/wechat", postWechatRecords);
module.exports = router;
//