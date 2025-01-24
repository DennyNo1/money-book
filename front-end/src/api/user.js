import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // 替换为你的后端地址

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
    console.error(error);
    throw error; // 可以在组件中处理错误
  }
};

export const checkUsername = async (username) => {
  try {
    console.log(username);
    const response = await axios.get(API_URL + `/user/checkUsername`, {
      params: {
        username: username,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error; // 可以在组件中处理错误
  }
};
