import apiClient from "./apiClient";

export const createOrder = async ({ userEmail, items }) => {
    const res = await apiClient.post("/orders/create", {
        user_email: userEmail,
        items: items.map((item) => ({
            listing_id: item.id,
            quantity: item.quantity,
        })),
    });
    return res.data; // { id, user_email, items, total_amount, status, created_at }
};

export const getOrdersByUser = async (userEmail) => {
    const res = await apiClient.get("/orders/history", {
        params: { user_email: userEmail },
    });
    return res.data;
};




