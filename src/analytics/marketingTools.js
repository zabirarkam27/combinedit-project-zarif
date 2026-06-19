import { createMetaEventId, sendMetaConversionEvent } from "../services/metaConversions";

const appendScript = ({ id, src, inline }) => {
  if (typeof document === "undefined") return null;
  const existing = document.getElementById(id);
  if (existing) return existing;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  if (src) script.src = src;
  if (inline) script.innerHTML = inline;
  document.head.appendChild(script);
  return script;
};

export const initGoogleAnalytics = (measurementId) => {
  if (!measurementId) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  appendScript({
    id: `ga4-${measurementId}`,
    src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
  });

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
  return true;
};

export const initGoogleTagManager = (containerId) => {
  if (!containerId) return false;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  appendScript({
    id: `gtm-${containerId}`,
    src: `https://www.googletagmanager.com/gtm.js?id=${containerId}`,
  });
  return true;
};

export const initMetaPixel = (pixelId) => {
  if (!pixelId) return false;

  if (!window.fbq) {
    window.fbq = function fbq() {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
    window.fbq.queue = [];
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window._fbq = window.fbq;
  }

  appendScript({
    id: "meta-pixel-sdk",
    src: "https://connect.facebook.net/en_US/fbevents.js",
  });

  window.fbq("init", pixelId);
  return true;
};

export const initTikTokPixel = (pixelId) => {
  if (!pixelId) return false;

  window.TiktokAnalyticsObject = "ttq";
  const ttq = (window.ttq = window.ttq || []);
  ttq.methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
  ];
  ttq.setAndDefer = (target, method) => {
    target[method] = (...args) => target.push([method, ...args]);
  };
  ttq.methods.forEach((method) => ttq.setAndDefer(ttq, method));
  ttq.instance = (id) => {
    const instance = ttq._i?.[id] || [];
    ttq.methods.forEach((method) => ttq.setAndDefer(instance, method));
    return instance;
  };
  ttq.load = (id) => {
    ttq._i = ttq._i || {};
    ttq._i[id] = [];
    ttq._i[id]._u = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=ttq`;
    appendScript({
      id: `tiktok-pixel-${id}`,
      src: ttq._i[id]._u,
    });
  };
  ttq.load(pixelId);
  return true;
};

export const initTwitterPixel = (pixelId) => {
  if (!pixelId) return false;

  window.twq =
    window.twq ||
    function twq() {
      window.twq.exe ? window.twq.exe.apply(window.twq, arguments) : window.twq.queue.push(arguments);
    };
  window.twq.version = "1.1";
  window.twq.queue = window.twq.queue || [];

  appendScript({
    id: "twitter-pixel-sdk",
    src: "https://static.ads-twitter.com/uwt.js",
  });

  window.twq("config", pixelId);
  return true;
};

export const initSnapchatPixel = (pixelId) => {
  if (!pixelId) return false;

  window.snaptr =
    window.snaptr ||
    function snaptr() {
      window.snaptr.handleRequest
        ? window.snaptr.handleRequest.apply(window.snaptr, arguments)
        : window.snaptr.queue.push(arguments);
    };
  window.snaptr.queue = window.snaptr.queue || [];

  appendScript({
    id: "snapchat-pixel-sdk",
    src: "https://sc-static.net/scevent.min.js",
  });

  window.snaptr("init", pixelId);
  return true;
};

export const initMarketingTool = (key, id) => {
  const initializers = {
    gaMeasurementId: initGoogleAnalytics,
    gtmId: initGoogleTagManager,
    metaPixelId: initMetaPixel,
    tiktokPixelId: initTikTokPixel,
    twitterPixelId: initTwitterPixel,
    snapPixelId: initSnapchatPixel,
  };

  return Boolean(initializers[key]?.(id));
};

export const initMarketingTools = (settings = {}) => {
  window.__marketingSettings = settings;
  const toolPairs = [
    ["gaMeasurementId", "gaMeasurementEnabled"],
    ["gtmId", "gtmEnabled"],
    ["metaPixelId", "metaPixelEnabled"],
    ["tiktokPixelId", "tiktokPixelEnabled"],
    ["twitterPixelId", "twitterPixelEnabled"],
    ["snapPixelId", "snapPixelEnabled"],
  ];

  toolPairs.forEach(([key, enabledKey]) => {
    const id = settings[key];
    const enabled = settings[enabledKey] !== false;
    if (id && enabled) initMarketingTool(key, id);
  });
};

export const trackMarketingPageView = (path) => {
  const settings = window.__marketingSettings || {};
  const metaEventId = createMetaEventId("PageView");

  if (window.gtag) window.gtag("event", "page_view", { page_path: path });
  if (window.fbq) window.fbq("track", "PageView", {}, { eventID: metaEventId });
  if (window.ttq?.page) window.ttq.page();
  if (window.twq) window.twq("track", "PageView");
  if (window.snaptr) window.snaptr("track", "PAGE_VIEW");
  if (window.dataLayer) window.dataLayer.push({ event: "page_view", page_path: path });

  if (settings.metaConversionsEnabled && settings.metaPixelId) {
    sendMetaConversionEvent({
      pixelId: settings.metaPixelId,
      eventName: "PageView",
      eventId: metaEventId,
      eventSourceUrl: window.location.href,
      testEventCode: settings.metaTestEventCode,
      customData: { page_path: path },
    }).catch((error) => {
      console.warn("Meta Conversion API PageView failed:", error.message);
    });
  }
};
