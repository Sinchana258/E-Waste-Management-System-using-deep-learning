// src/hooks/useAuth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../utils/axiosInstance";

/**
 * Auth shape:
 * { user: { id, fullName, email, phone }, token: string }
 *
 * Exposes:
 * - isLoggedIn (boolean)
 * - user (object|null)
 * - login({ access_token, user })
 * - logout()
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem("access_token") || null);

    useEffect(() => {
        // ensure axios instance has token on load
        setAuthToken(token);
    }, [token]);

    const login = (payload) => {
        // payload expected: { access_token, user }
        const t = payload.access_token || payload.token;
        const u = payload.user || payload;
        if (t) {
            setToken(t);
            localStorage.setItem("access_token", t);
        }
        if (u) {
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
        }
        // set axios default header
        setAuthToken(t);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setAuthToken(null);
    };

    const value = {
        user,
        token,
        isLoggedIn: Boolean(user && token),
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
};
