import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null); // { message, actionLabel, actionHref }

    const showToast = useCallback(({ message, actionLabel, actionHref, duration = 6000 }) => {
        setToast({ message, actionLabel, actionHref });

        if (duration > 0) {
            setTimeout(() => {
                setToast(null);
            }, duration);
        }
    }, []);

    const hideToast = useCallback(() => setToast(null), []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        console.error("useToast used outside ToastProvider");
    }
    return ctx || { toast: null, showToast: () => { }, hideToast: () => { } };
};
