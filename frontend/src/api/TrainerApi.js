import api from "./api";

export const getTrainers = () => api.get("/trainers");

export const addTrainer = (trainer) =>
    api.post("/trainers", trainer);

export const updateTrainer = (id, trainer) =>
    api.put(`/trainers/${id}`, trainer);

export const deleteTrainer = (id) =>
    api.delete(`/trainers/${id}`);