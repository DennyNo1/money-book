import axios from "axios";

const API_URL = "http://localhost:5000/api"; // 替换为你的后端地址

export const addBook = async (bookData) => {
  try {
    const response = await axios.post(API_URL + "/book", bookData);
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const getAllBooks = async () => {
  try {
    const response = await axios.get(API_URL + "/books");
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error get all books:", error);
    throw error; // 可以在组件中处理错误
  }
};
