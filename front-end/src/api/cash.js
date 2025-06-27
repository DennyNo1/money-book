import apiClient from "./apiClient";
export const createCashItem = async (itemName, balance) => {
    console.log(itemName, balance)
    try {
        //axios 的 post 方法语法是：axios.post(url, payload, config)
        const response = await apiClient.post("/cash", { itemName, balance });
        return response; // 返回新添加的书籍信息或状态
    } catch (error) {
        console.error("Error adding book:", error);
        throw error; // 可以在组件中处理错误
    }
};

export const getAllCashItem = async () => {
    try {
        const response = await apiClient.get("/cash");
        return response;
    } catch (error) {
        console.error("Error getting cash items:", error);
        throw error;
    }
};