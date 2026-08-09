import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        // Do NOT attach JWT to authentication/registration endpoints
        const publicEndpoints = [
            "/auth/login",
            "/auth/send-otp",
            "/auth/verify-otp",
            "/auth/register"
        ];

        if (
            token &&
            !publicEndpoints.includes(config.url)
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;