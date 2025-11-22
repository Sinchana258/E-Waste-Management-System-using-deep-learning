import React from "react";
import { useToast } from "../context/ToastContext";

const ToastBar = () => {
    const { toast, hideToast } = useToast();

    if (!toast) return null;

    return (
        <div className="w-full flex justify-center mb-4">
            <div className="flex items-center gap-3 bg-[#5a8807] text-white px-4 py-2 rounded-lg shadow text-sm max-w-md w-full md:w-auto">
                <span>{toast.message}</span>

                <button
                    onClick={hideToast}
                    className="text-xs opacity-80 hover:opacity-100 ml-auto"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ToastBar;
