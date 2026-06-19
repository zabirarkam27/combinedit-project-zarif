import { useState } from "react";
import { createOrder } from "../services/orders";
import { showErrorPopup, showSuccessPopup } from "../utils/popups";
import { trackMetaPurchase } from "../services/metaConversions";

const defaultOrderInfo = {
  name: "",
  phone: "",
  address: "",
  note: "",
  shippingCharge: 70,
  paymentMethod: "Cash on Delivery",
  paymentStatus: "pending",
};

const useOrderForm = (initialProduct = null) => {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({
      ...prev,
      [name]: name === "shippingCharge" ? Number(value) : value,
    }));
  };

  const handleOrderSubmit = async (payload) => {
    try {
      const response = await createOrder(payload);
      trackMetaPurchase({ ...payload, ...(response?.data || {}) }).catch((error) => {
        console.warn("Meta Conversion API Purchase failed:", error.message);
      });
      showSuccessPopup("Order placed successfully", "Thank you. We received your order.");
      setOrderInfo(defaultOrderInfo);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to submit order:", error);
      showErrorPopup("Failed to place order", "Please check your details and try again.");
    }
  };

  return {
    selectedProduct,
    setSelectedProduct,
    orderInfo,
    setOrderInfo,
    handleOrderChange,
    handleOrderSubmit,
  };
};

export default useOrderForm;
