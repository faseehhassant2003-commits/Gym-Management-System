import api from "./api";

export const getMembers = () => {
    return api.get("/members");
};

export const addMember = (member) => {
    return api.post("/members", member);
};

export const updateMember = (id, member) => {
    return api.put(`/members/${id}`, member);
};


export const deleteMember = (id) => {
    return api.delete(`/members/${id}`);
};

export const getMemberProfile = () => {
    return api.get(`/members/profile`);
};

export const getMemberByQrToken = (qrToken) => {
    return api.get(`/members/scan/${qrToken}`);
};

export const updateMemberProfile = (payload) => {
    return api.put(`/members/profile`, payload);
};