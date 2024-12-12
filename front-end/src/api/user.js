import axios from "axios";

const API_URL = "http://localhost:5000/api"; // 替换为你的后端地址

export const login = async (user) => {
  try {
    const response = await axios.post(API_URL + "/user/login", {
      user,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error(error);
    throw error; // 可以在组件中处理错误
  }
};

export const register = async (user) => {
  try {
    const response = await axios.post(API_URL + `/user/register`, { user });
    return response;
  } catch (error) {
    console.error( error);
    throw error; // 可以在组件中处理错误
  }
};
