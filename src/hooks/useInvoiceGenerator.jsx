import { pdf } from "@react-pdf/renderer";
import React from "react";
import InvoiceDocument from "../pages/DashBoard/InvoiceDocument";
import { getProfile } from "../services/profile";

const getInvoiceProfile = async () => {
  try {
    const profileResponse = await getProfile();
    return profileResponse?.data || {};
  } catch (error) {
    console.warn("Invoice profile branding could not be loaded:", error.message);
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
      const profile = await getInvoiceProfile();
      const themeColors = profile?.themeColors || {};
      const blob = await pdf(
        <InvoiceDocument orders={[order]} themeColors={themeColors} profile={profile} />
      ).toBlob();

      downloadBlob(blob, `invoice_${order.orderNumber || "order"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  const generateInvoicePDF = async (orders) => {
    if (!orders || !orders.length) return;
    try {
      const profile = await getInvoiceProfile();
      const themeColors = profile?.themeColors || {};
      const blob = await pdf(
        <InvoiceDocument orders={orders} themeColors={themeColors} profile={profile} />
      ).toBlob();

      downloadBlob(blob, "merged_invoices.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return { generateInvoice, generateInvoicePDF };
};

export default useInvoiceGenerator;

