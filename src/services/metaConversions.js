const ENDPOINT = "/api/meta-conversion";

export const createMetaEventId = (eventName = "event") =>
  `${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export const getMarketingSettings = () => {
  if (typeof window === "undefined") return {};
  return window.__marketingSettings || {};
};

export const sendMetaConversionEvent = async ({
  pixelId,
  eventName,
  eventId,
  eventSourceUrl,
  customData = {},
  userData = {},
  testEventCode,
  actionSource = "website",
} = {}) => {
  const settings = getMarketingSettings();
  const activePixelId = String(pixelId || settings.metaPixelId || "").trim();

  if (!activePixelId || !eventName) {
    return { ok: false, skipped: true, message: "Meta Pixel ID and event name are required." };
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pixelId: activePixelId,
      eventName,
      eventId: eventId || createMetaEventId(eventName),
      eventSourceUrl:
        eventSourceUrl ||
        (typeof window !== "undefined" ? window.location.href : undefined),
      customData,
      userData,
      testEventCode: testEventCode || settings.metaTestEventCode || "",
      actionSource,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Meta Conversion API request failed.");
  }

  return payload;
};

export const getOrderPurchasePayload = (order = {}) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const value = Number(order.grandTotal || 0);

  return {
    customData: {
      currency: "BDT",
      value,
      order_id: order.orderNumber || order._id || order.id || "",
      content_type: "product",
      contents: items.map((item) => ({
        id: item.productId || item._id || item.id || item.productName,
        quantity: Number(item.quantity || 1),
        item_price: Number(item.unitPrice || item.finalPrice || 0),
      })),
    },
    userData: {
      ph: order.phone,
      external_id: order.phone || order.name,
    },
  };
};

export const trackMetaPurchase = async (order = {}) => {
  const settings = getMarketingSettings();
  if (!settings.metaConversionsEnabled || !settings.metaPixelId) return null;

  const eventId = createMetaEventId("Purchase");
  const { customData, userData } = getOrderPurchasePayload(order);

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", customData, { eventID: eventId });
  }

  return sendMetaConversionEvent({
    eventName: "Purchase",
    eventId,
    customData,
    userData,
  });
};
