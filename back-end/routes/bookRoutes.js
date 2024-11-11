// routes/bookRoutes.js
const express = require("express");
const {
  addBook,
  getAllBooks,
  deleteBook,
} = require("../controller/bookController");

const router = express.Router();

// 定义路由,用restful风格
router.post("/book", addBook);
// router.get("/", () => console.log("get"));
router.get("/books", getAllBooks);
router.delete("/book/:name", deleteBook);
module.exports = router;
