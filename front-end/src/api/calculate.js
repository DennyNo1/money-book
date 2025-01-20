import apiClient from "./apiClient";

export const addCalculateTable = async (book, formula, data, field) => {
  try {
    const response = await apiClient.post("/book/calculate", {
      book: book,
      formula: formula,
      data: data,
      field: field,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error(error);
    throw error; // 可以在组件中处理错误
  }
};

export const getCalculateTable = async (book) => {
  try {
    const response = await apiClient.get(`/book/calculate?book=${book}`);
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error(error);
    throw error; // 可以在组件中处理错误
  }
};
