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

// 软删除现金项目
export const deleteCashItem = async (itemId) => {
    try {
        const response = await apiClient.delete(`/cash/${itemId}`);
        return response;
    } catch (error) {
        console.error("Error deleting cash item:", error);
        throw error;
    }
};

export const getCashHistory = async (itemName) => {
    try {
        const response = await apiClient.get(`/cash/history/${itemName}`);
        return response;
    } catch (error) {
        console.error("Error getting cash history:", error);
        throw error;
    }
};

export const modifyCashItem = async (itemId, balance) => {
    try {
        const response = await apiClient.put(`/cash/${itemId}`, { balance });
        return response;
    } catch (error) {
        console.error("Error modifying cash item:", error);
        throw error;
    }
};

