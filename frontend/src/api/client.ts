import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    headers: {"Content-Type": "application/json"},
    timeout: 5000,
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API error:", err?.response?.date ?? err.message);
        return Promise.reject(err);
    }
);