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
//import "./App.css"; // 引入样式文件（如果有）

//App.js 是作为根组件，其他组件通常会在其中被嵌套。
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {" "}
          {/* <h1>Welcome to My React App!</h1> */}
          {/* React的路由注册在App.js根组件 */}
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/moneybook" element={<MoneyBook></MoneyBook>}></Route>
          {/* 这里使用平级路由。子路由是子组件镶嵌到父组件里去了。 */}
          <Route path="/moneybook/:book_id" element={<MoneyTable />} />{" "}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/code" element={<Code />}></Route>
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App; // 导出 App 组件
