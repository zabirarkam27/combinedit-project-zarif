import api from "../api";

// GET: fetch marketing settings
export const fetchMarketingSettings = async () => {
  const res = await api.get("/marketing-tools");
  return res.data;
};

// PUT: update marketing settings
export const updateMarketingSettings = async (data) => {
  const res = await api.put("/marketing-tools", data);
  return res.data;
};
