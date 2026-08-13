import api from "./api";

const API_URL = "/api/payments";

export const createPaymentOrder = (memberId, planId) => {
    return api.post(
        `${API_URL}/create-order`,
        null,
        {
            params: {
                memberId,
                planId,
            },
        }
    );
};

export const verifyPayment = (paymentData) => {
    return api.post(
        `${API_URL}/verify`,
        paymentData
    );
};

export const getMyPayments = () => {
    return api.get(`${API_URL}/my`);
};