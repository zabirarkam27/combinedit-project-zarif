const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

export const normalizeHexColor = (color) => {
  if (!color) return "";
  const value = String(color).trim();
  const withHash = value.startsWith("#") ? value : `#${value}`;
  return HEX_COLOR_PATTERN.test(withHash) ? withHash.toLowerCase() : "";
};

const rgbToHex = (red, green, blue) =>
  `#${[red, green, blue]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
    .join("")}`;

const getImageDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export const extractDominantColor = async (file) => {
  if (!file?.type?.startsWith("image/")) return "";

  try {
    const src = await getImageDataUrl(file);
    const image = await loadImage(src);
    const canvas = document.createElement("canvas");
    const maxSize = 72;
    const ratio = image.width / image.height || 1;
    canvas.width = ratio > 1 ? maxSize : Math.max(1, Math.round(maxSize * ratio));
    canvas.height = ratio > 1 ? Math.max(1, Math.round(maxSize / ratio)) : maxSize;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return "";

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const buckets = new Map();

    for (let index = 0; index < data.length; index += 16) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      if (alpha < 160) continue;

      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const saturation = max === 0 ? 0 : (max - min) / max;
      if ((max > 238 && saturation < 0.16) || max < 24) continue;

      const key = [red, green, blue].map((value) => Math.round(value / 28) * 28).join("-");
      const bucket = buckets.get(key) || { count: 0, red: 0, green: 0, blue: 0, score: 0 };
      bucket.count += 1;
      bucket.red += red;
      bucket.green += green;
      bucket.blue += blue;
      bucket.score += 1 + saturation * 1.8;
      buckets.set(key, bucket);
    }

    const best = [...buckets.values()].sort((a, b) => b.score - a.score)[0];
    if (!best) return "";

    return rgbToHex(best.red / best.count, best.green / best.count, best.blue / best.count);
  } catch {
    return "";
  }
};

export const normalizeImageColorMap = (product = {}) => {
  const safeProduct = product && typeof product === "object" ? product : {};
  const map = {};

  const addPair = (image, color) => {
    const normalized = normalizeHexColor(color);
    if (image && normalized) map[image] = normalized;
  };

  if (safeProduct.imageColorMap && typeof safeProduct.imageColorMap === "object") {
    Object.entries(safeProduct.imageColorMap).forEach(([image, color]) => addPair(image, color));
  }

  if (Array.isArray(safeProduct.imageColors)) {
    safeProduct.imageColors.forEach((item) => {
      if (typeof item === "string") return;
      addPair(item?.image || item?.url || item?.src, item?.color || item?.hex);
    });
  } else if (safeProduct.imageColors && typeof safeProduct.imageColors === "object") {
    Object.entries(safeProduct.imageColors).forEach(([image, color]) => addPair(image, color));
  }

  return map;
};

export const buildImageColorPairs = (images = [], imageColorMap = {}) =>
  [...new Set(images)]
    .map((image) => ({
      image,
      color: normalizeHexColor(imageColorMap?.[image]),
    }))
    .filter((item) => item.image && item.color);

export const addUniqueColor = (colors = [], color) => {
  const normalized = normalizeHexColor(color);
  if (!normalized) return colors;
  return colors.some((item) => normalizeHexColor(item) === normalized)
    ? colors
    : [...colors, normalized];
};

export const removeColorFromMap = (imageColorMap = {}, color) => {
  const normalized = normalizeHexColor(color);
  return Object.fromEntries(
    Object.entries(imageColorMap).filter(([, value]) => normalizeHexColor(value) !== normalized)
  );
};

