import api from "../api";

// Create order
export const createOrder = (orderData) => {
  return api.post("/orders", orderData);
};

// Get all orders
export const getOrders = () => {
  return api.get("/orders");
};

// Update order status
export const updateOrderStatus = (orderId, status = "completed") => {
  return api.patch(`/orders/${orderId}`, { status });
};

// Delete an order
export const deleteOrder = (orderId) => {
  return api.delete(`/orders/${orderId}`);
};


