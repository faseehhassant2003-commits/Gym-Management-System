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