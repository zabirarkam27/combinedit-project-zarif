export const downloadInvoice = async (order) => {
  if (!order) return;

  const [{ pdf }, React, { default: InvoiceDocument }, { getProfile }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
    import("../pages/DashBoard/InvoiceDocument"),
    import("../services/profile"),
  ]);

  let themeColors = {};
  try {
    const profileResponse = await getProfile();
    themeColors = profileResponse?.data?.themeColors || {};
  } catch (error) {
    console.warn("Invoice theme colors could not be loaded:", error.message);
  }

  const blob = await pdf(
    React.createElement(InvoiceDocument, { orders: [order], themeColors })
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice_${order.orderNumber || "order"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
