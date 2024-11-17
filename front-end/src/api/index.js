import axios from "axios";
const API_URL = "http://localhost:5000/api"; // 替换为你的后端地址
export const getCSMarketIndex = async () => {
  try {
    const response = await axios.get(API_URL + "/index/cs_market");
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error get all books:", error);
    throw error; // 可以在组件中处理错误
  }
};
