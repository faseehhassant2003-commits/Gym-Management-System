import api from "./api";

export const sendChatMessage = async (message) => {
    const response = await api.post("/chat", {
        message: message
    });

    return response.data;
};

export const getChatHistory = async () => {
    const response = await api.get("/chat/history");

    return response.data;
};
export const clearChatHistory = async () => {
    await api.delete("/chat/history");
};