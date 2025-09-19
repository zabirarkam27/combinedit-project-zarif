import api from "../api"; // axios instance

export const createLandingPage = (data) => api.post("/landing-pages", data);
export const getLandingPages = () => api.get("/landing-pages");
export const getLandingPageById = (id) => api.get(`/landing-pages/${id}`);

