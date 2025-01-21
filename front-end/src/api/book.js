import apiClient from "./apiClient";

export const addBook = async (bookData, user_id) => {
  try {
    const response = await apiClient.post("/book", bookData, user_id);
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error adding book:", error);
    throw error; // 可以在组件中处理错误
  }
};

export const getAllBooks = async (user_id) => {
  try {
    const response = await apiClient.get(`/books?user_id=${user_id}`);
    return response; // 返回新添加的书籍信息或状态
  } catch (error) {
    console.error("Error get all books:", error);
    throw error; // 可以在组件中处理错误
  }
};

//正常来说，增删改查都应该依赖于bookid而不是bookname。这是之后改进的方向
export const deleteBook = async (book_id) => {
  try {
    const response = await apiClient.delete(`/book/${book_id}`);
    return response; // 返回删除的书籍信息或状态
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error; // 可以在组件中处理错误
  }
};
