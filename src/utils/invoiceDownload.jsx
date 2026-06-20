export const downloadInvoice = async (order) => {
  if (!order) return;

  const [{ pdf }, React, { default: InvoiceDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
    import("../pages/DashBoard/InvoiceDocument"),
  ]);

  const blob = await pdf(React.createElement(InvoiceDocument, { orders: [order] })).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice_${order.orderNumber || "order"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
