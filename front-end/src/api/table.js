import axios from "axios";

const API_URL = "http://localhost:5000/api"; // 替换为你的后端地址
export const addField = async ({ collection, field }) => {
  try {
    const response = await axios.post(API_URL + "/book/field", {
      collection,
      field,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};
export const getAllFields = async (collection) => {
  try {
    const response = await axios.get(
      API_URL + `/book/fields?collection=${collection}`
    );
    return response;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const addDoc = async ({ collection, doc }) => {
  try {
    const response = await axios.post(API_URL + "/book/doc", {
      collection,
      doc,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const getAllDocs = async (collection, order, orderBy) => {
  try {
    const response = await axios.get(API_URL + `/book/docs`, {
      params: {
        collection: collection,
        order: order,
        orderBy: orderBy,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const updateDoc = async ({ collection, doc }) => {
  try {
    const response = await axios.patch(API_URL + "/book/doc", {
      collection,
      doc,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error updating doc:", error);
    throw error; // 可以在组件中处理错误
  }
};
