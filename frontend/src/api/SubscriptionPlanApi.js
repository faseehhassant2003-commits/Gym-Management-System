import api from "./api";

export const getSubscriptionPlans = () => {
    return api.get("/api/subscription-plans");
};

export const getActiveSubscriptionPlans = () => {
    return api.get("/api/subscription-plans/active");
};

export const getSubscriptionPlanById = (id) => {
    return api.get(`/api/subscription-plans/${id}`);
};

export const addSubscriptionPlan = (plan) => {
    return api.post("/api/subscription-plans", plan);
};

export const updateSubscriptionPlan = (id, plan) => {
    return api.put(`/api/subscription-plans/${id}`, plan);
};

export const deleteSubscriptionPlan = (id) => {
    return api.delete(`/api/subscription-plans/${id}`);
};