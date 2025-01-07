const express = require("express");
const {
  getAllFields,
  addField,
  addDoc,
  getAllDocs,
  updateDoc,
} = require("../controller/tableController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();
// 定义路由,用restful风格
router.post("/book/field", addField);
// router.get("/", () => console.log("get"));
router.get("/book/fields", verifyToken, getAllFields);
router.post("/book/doc", verifyToken, addDoc);
router.get("/book/docs", verifyToken, getAllDocs);
router.patch("/book/doc", verifyToken, updateDoc);

module.exports = router;
