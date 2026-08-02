import axios from "axios";

const API_URL="https://gym-management-system-rn77.onrender.com/trainers";
export const getTrainers = () => axios.get(API_URL);

export const addTrainer = (trainer) =>
    axios.post(API_URL, trainer);

export const updateTrainer = (id, trainer) =>
    axios.put(`${API_URL}/${id}`, trainer);

export const deleteTrainer = (id) =>
    axios.delete(`${API_URL}/${id}`);