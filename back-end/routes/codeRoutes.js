const { addDoc, getAllDocs } = require("../service/commonService");
const express = require("express");
const router = express.Router();
router.post("/code/doc", addDoc);
router.get("/code/docs", getAllDocs);
module.exports = router;
