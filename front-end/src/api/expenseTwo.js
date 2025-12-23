import apiClient from "./apiClient";
export const importExpenseTwoRecords = async (records) => {
    try {
        const response = await apiClient.post("/expenseTwo", { records });
        return response;

    } catch (error) {
        console.error("Error importing expense two records:", error);
        throw error;
    }

};

export const getExpenseTwoByMonth = async (year, month) => {
    try {
        const response = await apiClient.get(`/expenseTwo/${year}/${month}`);
        return response;
    } catch (error) {
        console.error("Error fetching expense two records:", error);
        throw error;
    }
};