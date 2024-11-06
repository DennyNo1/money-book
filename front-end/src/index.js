
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // 从 react-dom/client 导入 createRoot
import './input.css'; // 引入 Tailwind CSS
import './output.css'; // 引入 Tailwind CSS 生成的输出文件
import App from './App';

//index.js 是应用的入口点，负责加载和渲染 App 组件。是App.js的底层
// 渲染 App 组件到 HTML 文档中的根节点
const root = ReactDOM.createRoot(document.getElementById('root')); // 创建根实例
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);