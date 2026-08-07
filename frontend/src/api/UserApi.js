import api from "./api";

// Get all users
export const getUsers = () => {
    return api.get("/users");
};

// Update user role
export const updateUserRole = (id, role) => {
    return api.put(`/users/${id}/role?role=${role}`);
};

// Enable / Disable user
export const updateUserStatus = (id, enabled) => {
    return api.put(`/users/${id}/status?enabled=${enabled}`);
};

// Delete user
export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};