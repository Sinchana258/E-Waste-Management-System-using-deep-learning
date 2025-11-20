// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute (default export)
 *
 * Usage:
 * <ProtectedRoute><SomePage /></ProtectedRoute>
 *
 * If not logged in, redirects to /sign-in and preserves `state.from`
 */
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        // redirect and save the attempted location
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    // Render children (which should be a valid React element)
    return children;
};

export default ProtectedRoute;
