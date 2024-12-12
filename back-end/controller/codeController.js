const mongoose = require("mongoose");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY;
const iv = process.env.IV;

// 加密函数
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  return Buffer.concat([cipher.update(text), cipher.final()]).toString("hex");
};

// 解密函数
const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "hex")),
    decipher.final(),
  ]).toString();
};
exports.getAllDocs = async (req, res) => {
  try {
    console.log("Received request");
    const { collection, order, orderBy } = req.query;

    // Step 1: 检查集合是否存在
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes(collection)) {
      // 如果集合不存在，返回 404 错误
      return res.status(404).json({
        message: `Collection '${collection}' does not exist`,
        data: [],
      });
    }

    let query = mongoose.connection.db.collection(collection).find({});

    // 如果 orderBy 和 order 存在，则添加排序
    if (orderBy && order) {
      // 如果 order 为 "asc" 表示升序，用 1，"desc" 表示降序，用 -1
      const sortOrder = order === "asc" ? 1 : -1;
      query = query.sort({ [orderBy]: sortOrder });
    }

    // 转换查询结果为数组
    const result = await query.toArray();

    result.forEach((doc) => {
      // 对密码进行解密
      doc.password = decrypt(doc.password);
    });

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
    console.error(error);
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

    //对doc进行加密
    doc.password = encrypt(doc.password);

    console.log(doc.password);

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
