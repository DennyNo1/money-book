const express = require("express");
const {
  getAllFields,
  addField,
  addDoc,
  getAllDocs,
  updateDoc,
} = require("../controller/tableController");

const router = express.Router();
// 定义路由,用restful风格
router.post("/book/field", addField);
// router.get("/", () => console.log("get"));
router.get("/book/fields", getAllFields);
router.post("/book/doc", addDoc);
router.get("/book/docs", getAllDocs);
router.patch("/book/doc", updateDoc);

module.exports = router;
