import apiClient from "./apiClient";

export const addField = async ({ book_id, field, type }) => {
  try {
    const response = await apiClient.post("/book/field", {
      book_id,
      field,
      type,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};
export const getAllFields = async (book_id) => {
  try {
    const response = await apiClient.get(`/book/fields?book_id=${book_id}`);
    return response;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const addDoc = async ({ book_id, doc }) => {
  try {
    const response = await apiClient.post("/book/doc", {
      book_id,
      doc,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const getAllDocs = async (book_id) => {
  try {
    const response = await apiClient.get(`/book/docs`, {
      params: {
        book_id: book_id,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const updateDoc = async ({ doc }) => {
  try {
    const response = await apiClient.patch("/book/doc", {
      doc,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error updating doc:", error);
    throw error; // 可以在组件中处理错误
  }
};
