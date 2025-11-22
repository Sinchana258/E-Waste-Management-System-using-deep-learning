import apiClient from "./apiClient";

export const createOrder = async ({ listingId, userEmail }) => {
    const res = await apiClient.post("/payments/create-order", {
        listing_id: listingId,
        user_email: userEmail,
    });
    return res.data; // { order_id, amount, message }
};
