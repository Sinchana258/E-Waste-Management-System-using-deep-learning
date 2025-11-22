import apiClient from "./apiClient";

export const fetchListings = async () => {
    const res = await apiClient.get("/marketplace/listings");
    return res.data;
};

export const fetchListingById = async (id) => {
    const res = await apiClient.get(`/marketplace/listings/${id}`);
    return res.data;
};
