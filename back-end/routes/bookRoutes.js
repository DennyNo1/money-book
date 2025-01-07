// routes/bookRoutes.js
const express = require("express");
const {
  addBook,
  getAllBooks,
  deleteBook,
} = require("../controller/bookController");

const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

// 定义路由,用restful风格
router.post("/book", verifyToken, addBook);
// router.get("/", () => console.log("get"));
router.get("/books", verifyToken, getAllBooks);
router.delete("/book/:name", verifyToken, deleteBook);
module.exports = router;
