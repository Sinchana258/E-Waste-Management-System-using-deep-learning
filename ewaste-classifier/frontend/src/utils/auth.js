// src/utils/auth.js
export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const isLoggedIn = () => !!getToken();

export const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};
