const CUSTOMER_ORDER_HISTORY_KEY = "customerOrderedProducts";
const HISTORY_LIMIT = 50;

const parseHistory = (value) => {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

const getOrderIdentity = (order) =>
  order?.orderNumber || order?._id || order?.id || order?.createdAt || String(Date.now());

const getItemImages = (item) => {
  const images = [
    item?.selectedImage,
    item?.selectedOptions?.image,
    item?.thumbnail,
    item?.image,
    ...(Array.isArray(item?.images) ? item.images : [item?.images]),
  ].filter(Boolean);

  return [...new Set(images)];
};

export const readCustomerOrderHistory = () => {
  const storage = getStorage();
  if (!storage) return [];
  return parseHistory(storage.getItem(CUSTOMER_ORDER_HISTORY_KEY));
};

export const saveCustomerOrder = (order) => {
  const storage = getStorage();
  if (!storage || !order) return [];

  const entry = {
    id: getOrderIdentity(order),
    orderNumber: order.orderNumber || "",
    createdAt: order.createdAt || new Date().toISOString(),
    customerName: order.name || "",
    customerPhone: order.phone || "",
    grandTotal: Number(order.grandTotal || 0),
    items: (Array.isArray(order.items) ? order.items : []).map((item) => ({
      productId: item.productId || item._id || item.id || "",
      productName: item.productName || item.name || "Product",
      unitPrice: Number(item.unitPrice || item.price || item.discountPrice || 0),
      quantity: Number(item.quantity || 1),
      finalPrice: Number(item.finalPrice || 0),
      color: item.color || item.selectedOptions?.color || "",
      variation: item.variation || item.selectedOptions?.size || "",
      selectedImage: getItemImages(item)[0] || "",
    })),
  };

  const existing = readCustomerOrderHistory();
  const next = [entry, ...existing.filter((item) => item.id !== entry.id)].slice(0, HISTORY_LIMIT);
  storage.setItem(CUSTOMER_ORDER_HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("customer-orders-updated"));
  return next;
};
