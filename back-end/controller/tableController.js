const mongoose = require("mongoose");
const Table = require("../model/tableModel");
exports.addField = async (req, res) => {
  try {
    console.log("Received request");

    // 获取请求体中的字段和集合
    const { field, collection } = req.body;

    // 检查字段和集合是否提供
    if (!field || !collection) {
      return res
        .status(400)
        .json({ message: "Field and collection are required" });
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

    // 检查 field 是否已经存在于集合中
    const fieldExists = await mongoose.connection.db
      .collection(collection)
      .findOne({ fieldName: field, type: "fieldName" });

    if (fieldExists) {
      // 如果字段已存在，返回提示
      return res.status(400).json({ message: "Field already exists." });
    }

    // 如果字段不存在，插入新的字段
    const insertResult = await mongoose.connection.db
      .collection(collection)
      .insertOne({
        fieldName: field,
        type: "fieldName",
      });

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
exports.getAllFields = async (req, res) => {
  try {
    console.log("Received request");
    const { collection } = req.query;
    // console.log(collection);
    // 使用 MongoDB 原生驱动操作动态集合
    const result = await mongoose.connection.db
      .collection(collection)
      .find({ type: "fieldName" }) // 查找字段 type 值为 'fieldName' 的文档
      .toArray(); // 转换结果为数组

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found with type 'fieldName'" });
    }

    // 返回查询结果
    res.status(200).json({ message: "Documents found", data: result });
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

    // 如果字段不存在，插入新的字段
    const insertResult = await mongoose.connection.db
      .collection(collection)
      .insertOne({
        doc,
        type: "doc",
      });

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
    const result = await mongoose.connection.db
      .collection(collection)
      .find({ type: "doc" }) // 查找字段 type 值为 'fieldName' 的文档
      .toArray(); // 转换结果为数组

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found with type 'doc'" });
    }

    // 返回查询结果
    res.status(200).json({ message: "Documents found", data: result });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
