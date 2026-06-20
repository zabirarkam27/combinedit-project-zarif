import { pdf } from "@react-pdf/renderer";
import React from "react";
import InvoiceDocument from "../pages/DashBoard/InvoiceDocument";
import { getProfile } from "../services/profile";

const getInvoiceTheme = async () => {
  try {
    const profileResponse = await getProfile();
    return profileResponse?.data?.themeColors || {};
  } catch (error) {
    console.warn("Invoice theme colors could not be loaded:", error.message);
    return {};
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const useInvoiceGenerator = () => {
  const generateInvoice = async (order) => {
    if (!order) return;
    try {
      const themeColors = await getInvoiceTheme();
      const blob = await pdf(
        <InvoiceDocument orders={[order]} themeColors={themeColors} />
      ).toBlob();

      downloadBlob(blob, `invoice_${order.orderNumber || "order"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  const generateInvoicePDF = async (orders) => {
    if (!orders || !orders.length) return;
    try {
      const themeColors = await getInvoiceTheme();
      const blob = await pdf(
        <InvoiceDocument orders={orders} themeColors={themeColors} />
      ).toBlob();

      downloadBlob(blob, "merged_invoices.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return { generateInvoice, generateInvoicePDF };
};

export default useInvoiceGenerator;
