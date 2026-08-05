import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        // Don't attach JWT when calling the login endpoint
        if (
            token &&
            config.url !== "/auth/login"
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);
export default api;