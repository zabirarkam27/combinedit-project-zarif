import { useState } from "react";
import { createOrder } from "../services/orders"; 

const useOrderForm = (initialProduct = null) => {
  const [orderInfo, setOrderInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [product, setProduct] = useState(initialProduct);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e, extraData = {}) => {
    e.preventDefault();

    try {
      let payload;

      if (extraData.items) {
        // 🔹 Cart Checkout Order
        payload = {
          name: orderInfo.name,
          phone: orderInfo.phone,
          address: orderInfo.address,
          note: orderInfo.note,
          items: extraData.items,
          grandTotal: extraData.grandTotal,
        };
      } else {
        // 🔹 Single Product Order
        payload = {
          name: orderInfo.name,
          phone: orderInfo.phone,
          address: orderInfo.address,
          note: orderInfo.note,
          items: [
            {
              productId: product?._id || product?.id,
              productName: product?.name,
              unitPrice: product?.price,
              quantity: extraData.quantity || 1,
              finalPrice: extraData.finalPrice || product?.price,
              status: "pending",
            },
          ],
          grandTotal: extraData.finalPrice || product?.price,
        };
      }

      console.log("📦 Sending order payload:", payload);
      await createOrder(payload);

      alert("✅ Order placed successfully!");
      setOrderInfo({ name: "", phone: "", address: "", note: "" });
    } catch (error) {
      console.error("❌ Failed to submit order:", error);
      alert("Failed to place order. Try again.");
    }
  };

  return {
    orderInfo,
    handleOrderChange,
    handleOrderSubmit,
    setProduct,
  };
};

export default useOrderForm;
