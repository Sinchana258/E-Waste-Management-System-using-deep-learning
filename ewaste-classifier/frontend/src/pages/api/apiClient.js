import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000", // FastAPI URL
});

export default apiClient;
