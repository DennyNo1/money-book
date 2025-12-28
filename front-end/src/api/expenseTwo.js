import apiClient from "./apiClient";
export const importAliRecords = async (records) => {
    try {
        const response = await apiClient.post("/expenseTwo/ali", { records });
        return response;

    } catch (error) {
        console.error("Error importing expense two records:", error);
        throw error;
    }

};
export const importWechatRecordWithAI = async (inputData) => {
    try {
        const response = await apiClient.post("/expenseTwo/wechat", { wechatRecords: inputData });
        return response;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
    }
}

export const getExpenseTwoByMonth = async (year, month) => {
    try {
        const response = await apiClient.get(`/expenseTwo/${year}/${month}`);
        return response;
    } catch (error) {
        console.error("Error fetching expense two records:", error);
        throw error;
    }
};