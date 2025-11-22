import apiClient from "./apiClient";

export const fetchProfile = async (email) => {
    const res = await apiClient.get("/users/me", {
        params: { email },
    });
    return res.data;
};

export const updateProfile = async (profile) => {
    const res = await apiClient.put("/users/me", profile);
    return res.data;
};
