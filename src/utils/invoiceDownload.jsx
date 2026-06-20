export const downloadInvoice = async (order) => {
  if (!order) return;

  const [{ pdf }, React, { default: InvoiceDocument }, { getProfile }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
    import("../pages/DashBoard/InvoiceDocument"),
    import("../services/profile"),
  ]);

  let profile = {};
  try {
    const profileResponse = await getProfile();
    profile = profileResponse?.data || {};
  } catch (error) {
    console.warn("Invoice profile branding could not be loaded:", error.message);
  }

  const themeColors = profile?.themeColors || {};

  const blob = await pdf(
    React.createElement(InvoiceDocument, { orders: [order], themeColors, profile })
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice_${order.orderNumber || "order"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

