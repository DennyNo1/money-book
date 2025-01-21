const mongoose = require("mongoose");
const Book = require("../model/bookModel");
const Calculate = require("../model/calculateModel");
exports.addBook = async (req, res) => {
  console.log("Received request");
  //name就是新建book的名字，user_id就是它的创建者的名字
  const { name, user_id } = req.body || {};

  if (!name || !user_id) {
    return res.status(400).json({ message: "Name and user_id are required." });
  }

  try {
    // // Step 2: 使用 `name` 字段创建新的集合
    // const newCollectionName = name;
    // const db = mongoose.connection.db; // 获取原生的 `db` 对象
    // // 检查集合是否存在
    // const collections = await db
    //   .listCollections({ name: newCollectionName })
    //   .toArray();
    // if (collections.length > 0) {
    //   return res
    //     .status(201)
    //     .json({ message: `Collection '${newCollectionName}' already exists` });
    // }
    // 创建新的集合
    // await db.createCollection(newCollectionName);

    // 检查是否已存在同名书籍
    const existingBook = await Book.findOne({ name });
    if (existingBook) {
      return res.status(400).json({ message: "Book name already exists." });
    }
    const book = new Book({ name, user_id });
    await book.save();

    res.status(200).json({
      message: "Add new book successfully.",
      name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
//只是获取某个用户的所有books
exports.getAllBooks = async (req, res) => {
  const { user_id } = req.query || {};

  if (!user_id) {
    return res.status(400).json({ message: "User_id are required." });
  }
  try {
    const books = await Book.find({ user_id: user_id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.deleteBook = async (req, res) => {
  const book_id = req.params.book_id;
  console.log(book_id);

  if (!book_id) {
    return res.status(400).json({ message: "Bookid is required" });
  }
  try {
    // const deleteCollectionName = name;
    // const db = mongoose.connection.db; // 获取原生的 `db` 对象

    // 先检查deleteBook集合是否存在
    // const collections = await db
    //   .listCollections({ name: deleteCollectionName })
    //   .toArray();
    // if (collections.length === 0) {
    //   return res.status(201).json({
    //     message: `Collection '${deleteCollectionName}' dose not exist`,
    //   });
    // }
    // await db.dropCollection(deleteCollectionName);

    //目前先只删除book collection的doc。后续如果有需要，再删除table和calculate collection的doc。
    const objectId = new mongoose.Types.ObjectId(book_id); // 正确//id格式转换
    await Book.deleteOne({ _id: objectId });

    res.status(200).json({
      message: "This book has been deleted ",
    });
  } catch (error) {
    console.error("Error details:", error); // 打印完整的错误信息
    res.status(500).json({ message: "An error occurred", error });
  }
};
