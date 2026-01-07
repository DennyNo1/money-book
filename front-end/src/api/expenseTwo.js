import apiClient from "./apiClient";
export const importAliRecords = async (records) => {
    try {
        const CHUNK_SIZE = 300;
        const responses = [];

        if (records.length > CHUNK_SIZE) {
            for (let i = 0; i < records.length; i += CHUNK_SIZE) {
                const chunk = records.slice(i, i + CHUNK_SIZE);
                const res = await apiClient.post("/expenseTwo/ali", { records: chunk });
                responses.push(res.data);
            }
        } else {
            const res = await apiClient.post("/expenseTwo/ali", { records });
            responses.push(res.data);
        }

        return responses; // 永远是数组

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

export const getExpenseRecordsMonthly = async (year, month) => {
    try {
        const response = await apiClient.get(`/expenseTwo`, {
            params: { year, month }
        });
        return response;
    } catch (error) {
        console.error("Error fetching expense two records:", error);
        throw error;
    }
};