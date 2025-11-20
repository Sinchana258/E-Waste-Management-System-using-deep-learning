// src/utils/axiosInstance.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

const instance = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    // you can set a reasonable timeout if you want
    // timeout: 15000,
});

// Attach token from localStorage on each request (safe fallback)
instance.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            // ignore
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (optional: centralize error handling)
instance.interceptors.response.use(
    (resp) => resp,
    (error) => {
        // You can extend: if 401 -> redirect to login, etc.
        return Promise.reject(error);
    }
);

/**
 * Helper to set token (used after login/signup)
 * and to ensure axios will send Authorization header
 */
export function setAuthToken(token) {
    if (token) {
        localStorage.setItem("access_token", token);
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        localStorage.removeItem("access_token");
        delete instance.defaults.headers.common["Authorization"];
    }
}

export default instance;
