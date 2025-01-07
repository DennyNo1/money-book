import apiClient from "./apiClient";

const API_URL = "http://localhost:5000/api"; // 替换为你的后端地址
export const addDoc = async ({ collection, doc }) => {
  try {
    doc.date = new Date().toISOString();
    const response = await apiClient.post(API_URL + "/code/doc", {
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
    const response = await apiClient.get(API_URL + `/code/docs`, {
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
