import api from "../api"; // axios instance

export const createLandingPage = (data, config) =>
  api.post("/landing-pages", data, config);
export const getLandingPages = (config) => api.get("/landing-pages", config);
export const getLandingPageById = (id, config) =>
  api.get(`/landing-pages/${id}`, config);
export const deleteLandingPage = (id) => api.delete(`/landing-pages/${id}`);
