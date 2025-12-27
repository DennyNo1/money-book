import apiClient from "./apiClient";

export const categorizeWechatRecordWithAI = async (inputData) => {
    try {
        const response = await apiClient.post("/ai/wechat", { wechatRecords: inputData });
        return response;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
    }
}