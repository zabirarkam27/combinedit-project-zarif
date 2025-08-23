import api from "../api";

export const getProducts = () => {
  return api.get("/products");
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const addProduct = (productData) => {
  return api.post("/products", productData);
};

export const updateProduct = (id, productData) => {
  return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};
