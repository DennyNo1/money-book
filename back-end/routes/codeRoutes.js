const { addDoc, getAllDocs } = require("../controller/codeController");
const express = require("express");
const router = express.Router();
router.post("/code/doc", addDoc);
router.get("/code/docs", getAllDocs);
module.exports = router;
