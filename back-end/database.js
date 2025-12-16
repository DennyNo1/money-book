const mongoose = require("mongoose");
const dotenv = require('dotenv');
// process.env.NODE_ENV用来告诉程序：你现在跑在什么环境里
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: '.env.development',
  });
}

async function connectToDatabase() {
  let mongoUrl;

  if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD) {
    mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
  } else {
    mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
  }

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin", // 如果需要指定认证数据库
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // 如果连接失败，退出程序
  }
}

module.exports = connectToDatabase;
