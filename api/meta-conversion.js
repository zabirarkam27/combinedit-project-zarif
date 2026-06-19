import { createHash } from "node:crypto";

const META_EVENT_ENDPOINT = "https://graph.facebook.com";
const DEFAULT_API_VERSION = "v21.0";
const HASHABLE_USER_FIELDS = new Set([
  "em",
  "ph",
  "fn",
  "ln",
  "ct",
  "st",
  "zp",
  "country",
  "external_id",
]);

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const normalize = (value) => String(value || "").trim().toLowerCase();

const sha256 = (value) => createHash("sha256").update(normalize(value)).digest("hex");

const isSha256Hash = (value) => /^[a-f0-9]{64}$/i.test(String(value || "").trim());

const sanitizeUserData = (userData = {}) =>
  Object.entries(userData).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value === "") return acc;

    if (Array.isArray(value)) {
      const cleaned = value.filter(Boolean);
      if (cleaned.length) acc[key] = HASHABLE_USER_FIELDS.has(key) ? cleaned.map((item) => (isSha256Hash(item) ? item : sha256(item))) : cleaned;
      return acc;
    }

    acc[key] = HASHABLE_USER_FIELDS.has(key) && !isSha256Hash(value) ? sha256(value) : value;
    return acc;
  }, {});

const readBody = async (req) => {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, message: "Method not allowed." });
  }

  const accessToken = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  if (!accessToken) {
    return sendJson(res, 500, {
      ok: false,
      message: "META_CONVERSIONS_ACCESS_TOKEN is not configured on the server.",
    });
  }

  try {
    const body = await readBody(req);
    const pixelId = String(body.pixelId || process.env.META_PIXEL_ID || "").trim();
    const eventName = String(body.eventName || "").trim();

    if (!/^\d{5,30}$/.test(pixelId)) {
      return sendJson(res, 400, { ok: false, message: "A valid Meta Pixel ID is required." });
    }

    if (!eventName) {
      return sendJson(res, 400, { ok: false, message: "eventName is required." });
    }

    const forwardedFor = req.headers["x-forwarded-for"];
    const clientIp =
      (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor || "")
        .split(",")[0]
        .trim() || req.socket?.remoteAddress;

    const userData = sanitizeUserData({
      ...(body.userData || {}),
      client_ip_address: body.userData?.client_ip_address || clientIp,
      client_user_agent: body.userData?.client_user_agent || req.headers["user-agent"],
    });

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: body.actionSource || "website",
      event_source_url: body.eventSourceUrl,
      event_id: body.eventId,
      user_data: userData,
      custom_data: body.customData || {},
    };

    Object.keys(eventPayload).forEach((key) => {
      if (eventPayload[key] === undefined || eventPayload[key] === null || eventPayload[key] === "") {
        delete eventPayload[key];
      }
    });

    const payload = {
      data: [eventPayload],
      partner_agent: "combinedit_project_zarif",
    };

    const testEventCode = String(body.testEventCode || process.env.META_TEST_EVENT_CODE || "").trim();
    if (testEventCode) payload.test_event_code = testEventCode;

    const apiVersion = process.env.META_CONVERSIONS_API_VERSION || DEFAULT_API_VERSION;
    const response = await fetch(`${META_EVENT_ENDPOINT}/${apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      return sendJson(res, response.status, {
        ok: false,
        message: result?.error?.message || "Meta Conversion API request failed.",
        meta: result,
      });
    }

    return sendJson(res, 200, { ok: true, meta: result });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error?.message || "Meta Conversion API request failed.",
    });
  }
}

