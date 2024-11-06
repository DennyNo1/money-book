// routes/bookRoutes.js
const express = require("express");
const { addBook, getAllBooks } = require("../controller/bookController");

const router = express.Router();

// 定义路由,用restful风格
router.post("/book", addBook);
// router.get("/", () => console.log("get"));
router.get("/books", getAllBooks);
module.exports = router;
