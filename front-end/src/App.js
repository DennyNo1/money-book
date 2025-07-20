// App.js
import React from "react";
import Home from "./pages/Home.jsx";
import MoneyBook from "./pages/MoneyBook.jsx";
import MoneyTable from "./pages/MoneyTable.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Code from "./pages/Code.jsx";
import Test from "./pages/Test.jsx";
import { ConfigProvider } from "antd"
import InvestChart from "./pages/InvestChart.jsx";
//import "./App.css"; // 引入样式文件（如果有）

//App.js 是作为根组件，其他组件通常会在其中被嵌套。
const App = () => {
  return (
    <div className="App">
      <ConfigProvider
        //Token 是设计系统中的最小单位，用来定义颜色、尺寸、间距等设计属性。可以理解为全局的设计变量。
        theme={{
          // token: {
          //   colorPrimary: '#22c55e', // 绿色主色调
          //   colorSuccess: '#16a34a', // 成功色
          //   colorInfo: '#22c55e',    // 信息色也用绿色
          // },
          components: {
            Button: {
              colorPrimary: '#16a34a',        // 更深沉的绿色（原来是中绿色）
              colorPrimaryHover: '#15803d',   // 悬浮时颜色（深绿色）
              colorPrimaryActive: '#14532d',  // 点击时颜色（更深绿色）
            },
            // Input: {
            //   colorPrimary: '#22c55e',        // 输入框聚焦时边框色
            //   colorPrimaryHover: '#16a34a',   // 输入框悬浮时边框色
            // },
            // Select: {
            //   colorPrimary: '#22c55e',        // 选择框主色
            // },
            // Checkbox: {
            //   colorPrimary: '#22c55e',        // 复选框主色
            // },
            // Radio: {
            //   colorPrimary: '#22c55e',        // 单选框主色
            // },
            // Switch: {
            //   colorPrimary: '#22c55e',        // 开关主色
            // }
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            {" "}
            {/* <h1>Welcome to My React App!</h1> */}
            {/* React的路由注册在App.js根组件 */}
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/moneybook" element={<MoneyBook></MoneyBook>}></Route>
            {/* 这里使用平级路由。子路由是子组件镶嵌到父组件里去了。 */}
            <Route path="/moneybook/:book_id" element={<InvestChart />} />{" "}
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/code" element={<Code />}></Route>
            <Route path="/test" element={<Test />} />

          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </div>
  );
};

export default App; // 导出 App 组件
