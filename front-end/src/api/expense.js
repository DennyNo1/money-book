import apiClient from "./apiClient";

export const createExpenseRecordMonthly = async (date, sources, note) => {
    try {
        console.log(date, sources, note)
        let total = sources.reduce((acc, curr) => acc + curr.amount, 0);
        const response = await apiClient.post("/expense", { date, total, sources, note });
        return response;
    } catch (error) {
        console.error("Error creating expense record monthly:", error);
        throw error;
    }
};

export const listExpenseRecordMonthly = async () => {
    try {
        const response = await apiClient.get("/expense");
        return response;
    } catch (error) {
        console.error("Error listing expense record monthly:", error);
        throw error;
    }
};