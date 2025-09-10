import { useState } from "react";
import { createOrder } from "../services/orders";

const useOrderForm = (initialProduct = null) => {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    shippingCharge: 70,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "pending",
  });

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({
      ...prev,
      [name]: name === "shippingCharge" ? Number(value) : value,
    }));
  };

  const handleOrderSubmit = async (payload) => {
    try {
      console.log("📦 Sending order payload:", payload);
      await createOrder(payload);
      alert("✅ Order placed successfully!");
      setOrderInfo({
        name: "",
        phone: "",
        address: "",
        note: "",
        shippingCharge: 70,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "pending",
      });
      setSelectedProduct(null);
    } catch (error) {
      console.error("❌ Failed to submit order:", error);
      alert("Failed to place order. Try again.");
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
