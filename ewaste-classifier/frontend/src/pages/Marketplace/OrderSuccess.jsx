import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const state = location.state || {};

    return (
        <div className="max-w-xl mx-auto px-4 py-10 text-center">
            <h1 className="text-2xl font-bold mb-3">Order Successful 🎉</h1>
            {state.title && (
                <p className="mb-1 font-semibold">{state.title}</p>
            )}
            {state.amount && (
                <p className="mb-1">Amount paid: ₹{state.amount}</p>
            )}
            {state.userEmail && (
                <p className="mb-4 text-sm text-gray-600">
                    We’ll reach out to you at <span className="font-medium">{state.userEmail}</span>
                </p>
            )}

            <Link
                to="/marketplace"
                className="inline-block mt-4 bg-[#5a8807] text-white px-4 py-2 rounded text-sm hover:bg-emerald-700"
            >
                Back to Marketplace
            </Link>
        </div>
    );
};

export default OrderSuccess;
