// app.js
const express = require("express");
const connectToDatabase = require("./database");
const bookRoutes = require("./routes/bookRoutes");
const tableRoutes = require("./routes/tableRoutes");
const apiRoutes = require("./routes/apiRoutes");
const codeRoutes = require("./routes/codeRoutes");
const userRoutes = require("./routes/userRoutes");
const calculateRoutes = require("./routes/calculateRoutes");
const cashRoutes = require("./routes/cashRoutes");
const investRoutes = require("./routes/investRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const expenseTwoRoutes = require("./routes/expenseTwoRoutes");
const aiRoutes = require("./routes/aiRoutes");
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
  const routes = [
    bookRoutes,
    tableRoutes,
    apiRoutes,
    codeRoutes,
    userRoutes,
    calculateRoutes,
    cashRoutes,
    investRoutes,
    expenseRoutes,
    expenseTwoRoutes,
    aiRoutes

  ];

  routes.forEach(route => {
    app.use("/api", route);
  });
  //测试用
  app.get("/api", (req, res) => {
    res.send("Hello from the backend!");
  });
  // 全局错误处理器（必须最后）
  //真正系统错误（500）DB down 网络异常 未知异常
  app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
      message: 'Internal Server Error'
    });
  });
  // 启动服务器
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
  });
})();
// const { OpenAI } = require("openai");


// const openai = new OpenAI(
//   {
//     // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
//     apiKey: process.env.ALI_API_KEY,
//     baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
//   }
// );

// // async function main() {
// //   const completion = await openai.chat.completions.create({
// //     model: "qwen-flash",  //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
// //     messages: [
// //       { role: "system", content: "You are a helpful assistant." },
// //       { role: "user", content: "你是谁？" }
// //     ],
// //   });
// //   console.log(JSON.stringify(completion))
// // }

// // main();