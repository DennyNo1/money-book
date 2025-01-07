import apiClient from "./apiClient";

export const addField = async ({ collection, field }) => {
  try {
    const response = await apiClient.post("/book/field", {
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
    const response = await apiClient.get(
      `/book/fields?collection=${collection}`
    );
    return response;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const addDoc = async ({ collection, doc }) => {
  try {
    const response = await apiClient.post("/book/doc", {
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
    const response = await apiClient.get(`/book/docs`, {
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
    const response = await apiClient.patch("/book/doc", {
      collection,
      doc,
    });
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error updating doc:", error);
    throw error; // 可以在组件中处理错误
  }
};
