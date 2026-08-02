import axios from "axios";

const API_URL = "http://localhost:8080/members";

export const getMembers = () => {
    return axios.get(API_URL);
};

export const addMember = (member) => {
    return axios.post(API_URL, member);
};

export const updateMember = (id, member) => {
    return axios.put(`${API_URL}/${id}`, member);
};


export const deleteMember = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};