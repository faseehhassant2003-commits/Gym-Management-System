import api from "./api";

// Get all subscriptions of a member
export const getMemberSubscriptions = (memberId) => {
  return api.get(`/api/member-subscriptions/member/${memberId}`);
};

// Get the current active subscription
export const getActiveSubscription = (memberId) => {
  return api.get(`/api/member-subscriptions/member/${memberId}/active`);
};

// Subscribe a member to a plan
export const subscribeToPlan = (memberId, planId) => {
  return api.post(
    `/api/member-subscriptions/subscribe?memberId=${memberId}&planId=${planId}`
  );
};

// Admin - Get all member subscriptions
export const getAllSubscriptions = () => {
  return api.get("/api/member-subscriptions/admin/all");
};

// Admin - Deactivate a member subscription
export const deactivateSubscription = (subscriptionId) => {
  return api.put(
    `/api/member-subscriptions/admin/${subscriptionId}/deactivate`
  );
};