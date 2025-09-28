// services/profile.js
import api from "../api";

// Get Profile
export const getProfile = () => {
  return api.get("/admin-profile");
};

// Update Profile
export const updateProfile = (formData) => {
  return api.put("/admin-profile", formData);
};
