const mongoose = require("mongoose");
const Book = require("../model/bookModel");
const Calculate = require("../model/calculateModel");
exports.addBook = async (req, res) => {
  console.log("Received request");
  const { name } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    // Step 2: 使用 `name` 字段创建新的集合
    const newCollectionName = name;
    const db = mongoose.connection.db; // 获取原生的 `db` 对象

    // 检查集合是否存在
    const collections = await db
      .listCollections({ name: newCollectionName })
      .toArray();
    if (collections.length > 0) {
      return res
        .status(201)
        .json({ message: `Collection '${newCollectionName}' already exists` });
    }

    const book = new Book({ name });
    await book.save();

    // 创建新的集合
    await db.createCollection(newCollectionName);

    res.status(200).json({
      message: "Document added and new collection created",
      newCollectionName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.deleteBook = async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    const deleteCollectionName = name;
    const db = mongoose.connection.db; // 获取原生的 `db` 对象

    // 先检查deleteBook集合是否存在
    const collections = await db
      .listCollections({ name: deleteCollectionName })
      .toArray();
    if (collections.length === 0) {
      return res.status(201).json({
        message: `Collection '${deleteCollectionName}' dose not exist`,
      });
    }
    await db.dropCollection(deleteCollectionName);
    //
    const books = await Book.deleteOne({ name });
    await Calculate.deleteOne({ book: name });
    res.status(200).json({
      message: "This book has been deleted and collection dropped",
      deleteCollectionName,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
