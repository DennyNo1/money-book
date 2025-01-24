const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

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
