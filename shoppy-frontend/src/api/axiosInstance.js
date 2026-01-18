import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { "Content-type": "application/json" },
});

// Interceptor for attaching JWT Token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.accessToken) {
            config.headers["Authorization"] = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;