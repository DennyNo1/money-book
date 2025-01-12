// app.js
const express = require("express");
const connectToDatabase = require("./database");
const bookRoutes = require("./routes/bookRoutes");
const tableRoutes = require("./routes/tableRoutes");
const apiRoutes = require("./routes/apiRoutes");
const codeRoutes = require("./routes/codeRoutes");
const userRoutes = require("./routes/userRoutes");
const calculateRoutes = require("./routes/calculateRoutes");
const cors = require("cors"); // 引入 cors 中间件
require("dotenv").config();

const app = express();
app.use(express.json());
// 使用 cors 允许所有来源请求
app.use(cors());

(async () => {
  // 连接数据库
  await connectToDatabase();

  // 使用路由
  app.use("/api", bookRoutes);
  app.use("/api", tableRoutes);
  app.use("/api", apiRoutes);
  app.use("/api", codeRoutes);
  app.use("/api", userRoutes);
  app.use("/api", calculateRoutes);

  // 启动服务器
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
  });
})();
