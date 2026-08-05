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