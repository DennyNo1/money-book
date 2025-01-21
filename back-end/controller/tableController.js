const mongoose = require("mongoose");

const Book = require("../model/bookModel");

//添加一个field，仅需要对book表修改doc。
exports.addField = async (req, res) => {
  try {
    console.log("Received request");

    // 获取请求体中的想新增的字段名和它的目标集合
    const { field, book_id, type } = req.body;

    // 检查字段和集合是否提供
    if (!field || !book_id || !type) {
      return res
        .status(400)
        .json({ message: "Field, book_id and type are required" });
    }

    // 检查该集合是否存在
    // const collections = await mongoose.connection.db
    //   .listCollections()
    //   .toArray();
    // const collectionNames = collections.map((col) => col.name);

    // if (!collectionNames.includes(collection)) {
    //   return res
    //     .status(400)
    //     .json({ message: `Collection '${collection}' does not exist.` });
    // }

    const objectId = new mongoose.Types.ObjectId(book_id);
    //获取到请求的collection的doc
    const doc = await Book.findOne({ _id: objectId });
    // 检查 field 是否已经存在于集合中
    const fieldExists = doc.fields.includes(field);
    if (fieldExists) {
      // 如果字段已存在，返回提示。目前不支持字段修改。
      return res.status(400).json({ message: "Field already exists." });
    }

    // 如果字段不存在，插入新的字段

    doc.fields.push({ field: field, type: type }); // 直接用数组方法插入
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
    const { book_id } = req.query;
    const objectId = new mongoose.Types.ObjectId(book_id);
    const doc = await Book.findOne({ _id: objectId });

    if (doc === null) {
      return res.status(404).json({ message: "No such a collection'" });
    }

    // 返回查询结果
    res
      .status(200)
      .json({ message: "Fields of this book found", data: doc.fields });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
exports.addDoc = async (req, res) => {
  try {
    // 获取请求体中的doc和集合
    const { doc, book_id } = req.body;

    // 检查doc和集合是否提供
    if (!doc || !book_id) {
      return res.status(400).json({ message: "Doc and book_id are required" });
    }

    // 检查集合是否存在
    // const collections = await mongoose.connection.db
    //   .listCollections()
    //   .toArray();
    // const collectionNames = collections.map((col) => col.name);

    // if (!collectionNames.includes(collection)) {
    //   return res
    //     .status(400)
    //     .json({ message: `Collection '${collection}' does not exist.` });
    // }

    //把book_id放入doc
    doc.book_id = book_id;
    const insertResult = await mongoose.connection.db
      .collection("table")
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
    //目前不进行排序
    const { book_id } = req.query;

    // Step 1: 检查集合是否存在
    // const collections = await mongoose.connection.db
    //   .listCollections()
    //   .toArray();
    // const collectionNames = collections.map((col) => col.name);

    // if (!collectionNames.includes(collection)) {
    //   // 如果集合不存在，返回 404 错误
    //   return res.status(404).json({
    //     message: `Collection '${collection}' does not exist`,
    //     data: [],
    //   });
    // }

    let query = mongoose.connection.db
      .collection("table")
      .find({ book_id: book_id });

    // 如果 orderBy 和 order 存在，则添加排序
    // if (orderBy && order) {
    //   // 如果 order 为 "asc" 表示升序，用 1，"desc" 表示降序，用 -1
    //   const sortOrder = order === "asc" ? 1 : -1;
    //   query = query.sort({ [orderBy]: sortOrder });
    // }

    // 转换查询结果为数组
    const result = await query.toArray();

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
exports.updateDoc = async (req, res) => {
  const { doc } = req.body;

  try {
    // Step 1: 检查集合是否存在
    // const collections = await mongoose.connection.db
    //   .listCollections()
    //   .toArray();
    // const collectionNames = collections.map((col) => col.name);

    // if (!collectionNames.includes(collection)) {
    //   // 如果集合不存在，返回 404 错误
    //   return res.status(404).json({
    //     message: `Collection '${collection}' does not exist`,
    //     data: [],
    //   });
    // }
    // Step 2: Update the document
    const _id = doc._id;
    const newDoc = doc;
    delete newDoc._id;

    // console.log("Original _id:", doc._id); // 检查 doc._id 的原始值
    // console.log("ObjectId format:", new mongoose.Types.ObjectId(doc._id)); // 检查转换后的 ObjectId

    const result = await mongoose.connection.db.collection("table").updateOne(
      // Use the provided filter to find the document
      { _id: new mongoose.Types.ObjectId(_id) }, // 查询条件：根据 _id 查找文档
      { $set: newDoc }
    );

    // Step 3: Send a success response
    res.status(200).json({
      message: "Document updated successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors that may occur
    console.error("Error updating document:", error);
    res.status(500).json({
      message: "Error updating document",
      error: error.message,
    });
  }
};
