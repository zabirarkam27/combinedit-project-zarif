import { pdf } from "@react-pdf/renderer";
import React from "react";
import InvoiceDocument from "../pages/DashBoard/InvoiceDocument";

// ✅ react-pdf এর Document কে সরাসরি pdf() এ wrap করতে হবে
const useInvoiceGenerator = () => {
  // একক অর্ডারের জন্য
  const generateInvoice = async (order) => {
    if (!order) return;
    try {
      const blob = await pdf(
        <InvoiceDocument orders={[order]} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${order.orderNumber || "order"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  // একাধিক অর্ডারের জন্য
  const generateInvoicePDF = async (orders) => {
    if (!orders || !orders.length) return;
    try {
      const blob = await pdf(
        <InvoiceDocument orders={orders} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_invoices.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return { generateInvoice, generateInvoicePDF };
};

export default useInvoiceGenerator;
