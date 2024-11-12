const mongoose = require("mongoose");
const Table = require("../model/tableModel");
const Book = require("../model/bookModel");

//添加字段现在改变为对BookModel进行的操作
exports.addField = async (req, res) => {
  try {
    console.log("Received request");

    // 获取请求体中的想新增的字段名和它的目标集合
    const { field, collection } = req.body;

    // 检查字段和集合是否提供
    if (!field || !collection) {
      return res
        .status(400)
        .json({ message: "Field and collection are required" });
    }

    // 检查该集合是否存在
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes(collection)) {
      return res
        .status(400)
        .json({ message: `Collection '${collection}' does not exist.` });
    }

    //拿到原来的doc
    const doc = await Book.findOne({ name: collection });
    // 检查 field 是否已经存在于集合中
    const fieldExists = doc.fields.includes(field);
    if (fieldExists) {
      // 如果字段已存在，返回提示
      return res.status(400).json({ message: "Field already exists." });
    }

    // 如果字段不存在，插入新的字段

    doc.fields.push(field); // 直接用数组方法插入
    const insertResult = await doc.save(); // 保存文档

    // 返回成功响应
    res.status(200).json({
      message: "Field added successfully",
      result: insertResult,
    });
  } catch (error) {
    console.error(error);
    // 返回服务器错误响应
    res.status(500).json({ message: "An error occurred", error });
  }
};

//同样是对BookModel进行的操作
exports.getAllFields = async (req, res) => {
  try {
    console.log("Received request");
    const { collection } = req.query;
    // console.log(collection);
    // 使用 MongoDB 原生驱动操作动态集合
    const doc = await Book.findOne({ name: collection });

    if (doc === null) {
      return res.status(404).json({ message: "No such a collection'" });
    }

    // 返回查询结果
    res
      .status(200)
      .json({ message: "Fields of this book found", data: doc.fields });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
exports.addDoc = async (req, res) => {
  try {
    console.log("Received request");

    // 获取请求体中的doc和集合
    const { doc, collection } = req.body;

    // 检查doc和集合是否提供
    if (!doc || !collection) {
      return res
        .status(400)
        .json({ message: "Doc and collection are required" });
    }

    // 检查集合是否存在
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes(collection)) {
      return res
        .status(400)
        .json({ message: `Collection '${collection}' does not exist.` });
    }

    //目前允许重复插入doc

    // 如果字段不存在，插入新的字段。这里是不检查doc字段和设定字段是否匹配的。
    const insertResult = await mongoose.connection.db
      .collection(collection)
      .insertOne(doc);

    // 返回成功响应
    res.status(200).json({
      message: "Doc added successfully",
      result: insertResult,
    });
  } catch (error) {
    console.error(error);
    // 返回服务器错误响应
    res.status(500).json({ message: "An error occurred", error });
  }
};
exports.getAllDocs = async (req, res) => {
  try {
    console.log("Received request");
    const { collection } = req.query;
    // console.log(collection);
    // 使用 MongoDB 原生驱动操作动态集合
    // Step 1: 检查集合是否存在
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes(collection)) {
      // 如果集合不存在，返回 404 错误
      return res
        .status(404)
        .json({
          message: `Collection '${collection}' does not exist`,
          data: [],
        });
    }

    // Step 2: 检查该集合是否有文档
    const result = await mongoose.connection.db
      .collection(collection)
      .find({}) // 查找所有文档
      .toArray(); // 转换结果为数组

    if (result.length === 0) {
      // 如果集合有，但没有文档，返回适当的响应
      return res
        .status(200)
        .json({ message: "No documents found in the collection", data: [] });
    }

    // 返回查询结果
    res.status(200).json({ message: "Documents found", data: result });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
