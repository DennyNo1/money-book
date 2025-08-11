import apiClient from "./apiClient";
export const createInvestItem = async (itemName, description, balance, price, amount, total, type, investDate, note) => {

    try {
        //axios 的 post 方法语法是：axios.post(url, payload, config)
        const response = await apiClient.post("/invest", { itemName, description, balance, price, amount, total, type, investDate, note });
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

export const makeInvest = async (itemId, balance, price, amount, total, type, investDate, note) => {
    try {
        const response = await apiClient.post("/investing", { itemId, balance, price, amount, total, type, investDate, note });
        return response;
    } catch (error) {
        console.error("Error making invest:", error);
        throw error;
    }
};

export const getInvestmentHistory = async (itemId,) => {
    try {
        const response = await apiClient.get(`/invest/${itemId}`);
        return response;
    } catch (error) {
        console.error("Error get one investment history:", error);
        throw error;
    }
};

export const deleteInvestItem = async (itemId) => {
    try {
        const response = await apiClient.delete(`/invest/${itemId}`);
        return response;
    } catch (error) {
        console.error("Error deleting investment:", error);
        throw error;
    }
};
//?
export const checkDuplicateInvestment = async (itemName) => {
    try {
        const response = await apiClient.get(`/investment?itemName=${itemName}`);
        return response;
    } catch (error) {
        console.error("Error deleting investment:", error);
        throw error;
    }
};


export const patchInvestment = async (itemId, epilogue) => {
    //
    try {
        if (epilogue === undefined) epilogue = ''
        const response = await apiClient.patch(`/invest/${itemId}`, { epilogue });
        return response;
    }
    catch (error) {
        console.error("Error patch investment:", error);
        throw error;
    }
}