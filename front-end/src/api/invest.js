import apiClient from "./apiClient";
export const createCashItem = async (itemName, balance, price, amount, total, type, investDate) => {

    try {
        //axios 的 post 方法语法是：axios.post(url, payload, config)
        const response = await apiClient.post("/invest", { itemName, balance, price, amount, total, type, investDate });
        return response; // 返回新添加的书籍信息或状态
    } catch (error) {
        console.error("Error creating invest item:", error);
        throw error; // 可以在组件中处理错误
    }
};
export const getInvestItem = async () => {
    try {
        const response = await apiClient.get("/invest");
        return response;
    } catch (error) {
        console.error("Error getting invest item:", error);
        throw error;
    }
};