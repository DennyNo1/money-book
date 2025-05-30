const mongoose = require("mongoose");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY;
const iv = process.env.IV;
const User = require("../model/userModel");
const { generateToken } = require("../utils/jwtHelper");
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

//登录
exports.login = async (req, res) => {
  console.log("login");
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "User are required" });
    }
    console.log(user.username);

    // const users = await User.find();
    // 查看所有用户
    //console.log(users);

    //用用户名去查询
    const queryUser = await User.findOne({ username: user.username });
    if (queryUser) {
      //解密密码
      const decryptedPassword = decrypt(queryUser.password);
      //比较密码
      if (decryptedPassword === user.password) {
        const username = queryUser.username;
        console.log({ username });
        const jwt = generateToken({ username });

        console.log(jwt);
        //登录成功
        return res
          .status(200)
          .json({ message: "login success", token: jwt, user: queryUser });
      } else {
        return res
          .status(400)
          .json({ message: "Password does not match username" });
      }
    } else {
      return res.status(400).json({ message: "User is not registered" });
    }
  } catch (error) {
    res.status(500).json({ message: "login error", error });
  }
};

//注册
exports.register = async (req, res) => {
  try {
    console.log("Received request");
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "Doc are required" });
    }
    //对doc进行加密
    user.password = encrypt(user.password);
    //目前先允许相同的用户名存在
    const insertResult = await mongoose.connection.db
      .collection("user")
      .insertOne(user);
    // 返回成功响应
    res.status(200).json({
      message: "Doc added successfully",
      result: insertResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding doc", error });
  }
};

//用户名重复检测
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    console.log(username);
    if (!username) {
      return res.status(400).json({ message: "username are required" });
    }
    const queryUser = await User.findOne({ username: username });
    if (queryUser) {
      return res.status(409).json({ message: "Username already taken" });
    }
    return res.status(200).json({ message: "Username is available" });
  } catch (error) {
    res.status(500).json({ message: "check username error", error });
  }
};
//chatgpt返回200的条件很严格，可以说全部结果和条件符合预期的唯一结果才能使用200.其他比如说这个重复户名都当作异常，它认为也是业务异常。我个人不赞同这样，但也不是很反对。
