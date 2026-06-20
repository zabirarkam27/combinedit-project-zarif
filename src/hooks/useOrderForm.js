import { useState } from "react";
import { createOrder } from "../services/orders";
import { showErrorPopup, showOrderSuccessPopup } from "../utils/popups";
import { trackMetaPurchase } from "../services/metaConversions";
import useInvoiceGenerator from "./useInvoiceGenerator";
import { saveCustomerOrder } from "../utils/customerOrderHistory";

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
  const { generateInvoice } = useInvoiceGenerator();

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
      const placedOrder = { ...payload, ...(response?.data || {}) };
      saveCustomerOrder(placedOrder);
      trackMetaPurchase(placedOrder).catch((error) => {
        console.warn("Meta Conversion API Purchase failed:", error.message);
      });
      const result = await showOrderSuccessPopup(
        "Order placed successfully",
        "Thank you. We received your order."
      );
      if (result.isConfirmed) {
        const { downloadInvoice } = await import("../utils/invoiceDownload.jsx");
        await downloadInvoice(placedOrder);
      }
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




