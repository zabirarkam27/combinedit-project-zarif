import api from "../api";

// create order
export const createOrder = (orderData) => {
  return api.post("/orders", orderData);
};

// get all orders
export const getOrders = () => {
  return api.get("/orders");
};

// update order status
export const updateOrderStatus = (orderId, status = "completed") => {
  return api.patch(`/orders/${orderId}`, { status });
};

