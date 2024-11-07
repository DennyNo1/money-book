const express = require("express");
const { getAllFields, addField } = require("../controller/tableController");
const router = express.Router();
// 定义路由,用restful风格
router.post("/book/field", addField);
// router.get("/", () => console.log("get"));
router.get("/book/fields", getAllFields);
module.exports = router;
