const mongoose = require("mongoose");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY;
const iv = process.env.IV;
const User = require("../model/userModel");
const RefreshToken = require("../model/refreshTokenModel");
const { generateToken } = require("../utils/jwtHelper");
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");


//加密函数
const encrypt = (text) => {
  // console.log("encrypt");

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

  //与register统一
  const { user } = req.body;

  if (!user || !user.email || !user.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    //根据email查询
    const queryUser = await User.findOne({ email: user.email });

    if (queryUser) {
      //解密密码
      const decryptedPassword = decrypt(queryUser.password);

      //登录成功
      if (decryptedPassword === user.password) {
        const username = queryUser.username;
        //为了防止用户短时间内多次登录，可能造成payload重复，所以在payload中添加tokenid，用uuid生成
        const accessPayload = {
          "tokenType": "access",
          "tokenId": uuidv4(),
          email: queryUser.email,
          nickName: queryUser.nickName,
          userId: queryUser._id
        };
        const refreshPayload = {
          "tokenType": "refresh",
          "tokenId": uuidv4(),
          email: queryUser.email,
          nickName: queryUser.nickName,
          userId: queryUser._id
        };
        const accessToken = generateToken(accessPayload, "accessToken");
        const refreshToken = generateToken(refreshPayload, "refreshToken");

        //安全起见
        const { _id, userId, nickname } = queryUser;
        const result = { _id, userId, nickname };

        //计算30天后的过期时间（用于数据库中的 refreshToken 记录）
        const tokenExpiration = new Date();
        tokenExpiration.setDate(tokenExpiration.getDate() + 30);

        const refreshTokenDoc = new RefreshToken({
          tokenId: refreshPayload.tokenId,
          userModel: result,
          tokenExp: tokenExpiration,
          createdAt: Date.now(),
          isRevoked: false,
        });
        await refreshTokenDoc.save();
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        //登录成功
        return res
          .status(200)
          .json({ message: "login success", accessToken: accessToken, user: queryUser });
      } else {
        return res.status(400).json({ message: "Password does not match username" });
      }
    } else {
      return res.status(400).json({ message: "User is not registered" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error", error });
  }
};

//注册
exports.register = async (req, res) => {
  try {
    console.log("/user/register");
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "Doc are required" });
    }
    //对doc进行加密
    user.password = encrypt(user.password);
    //现在是以邮箱登录，所以允许相同用户名存在
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

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;  // 从 cookie 中提取
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    //同样自动验证过期
    const payload = jwt.verify(token, secretKey);

    // 检查 token 是否被撤销（黑名单机制），或者数据库中状态
    const refreshTokenDoc = await RefreshToken.findOne({ tokenId: payload.tokenId });
    if (!refreshTokenDoc || refreshTokenDoc.isRevoked) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    const queryUser = refreshTokenDoc.userModel;
    // 生成新 access token
    const newAccessPayload = {
      "tokenType": "access",
      "tokenId": uuidv4(),
      email: queryUser.email,
      nickName: queryUser.nickName,
      userId: queryUser._id
    };
    const newAccessToken = generateToken(newAccessPayload, "accessToken");
    res.json({ accessToken: newAccessToken, user: queryUser });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
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
