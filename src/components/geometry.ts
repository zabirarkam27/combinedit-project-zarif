export const NAV_HEIGHT = 80;
export const NAV_MAX_WIDTH = 420;
export const CIRCLE_DIAMETER = 64;
export const CIRCLE_TOP_OFFSET = -28;
export const CURVE_WIDTH = 120;
export const CURVE_DEPTH = 28;

export const buildNotchPath = (
  centerX: number,
  width: number,
  height = NAV_HEIGHT,
  curveWidth = CURVE_WIDTH,
  curveDepth = CURVE_DEPTH
) => {
  const half = curveWidth / 2;
  const safeCenter = Math.min(Math.max(centerX, half), width - half);
  const left = safeCenter - half;
  const right = safeCenter + half;
  const shoulder = half * 0.55;

  return [
    `M0,0`,
    `H${round(left)}`,
    `C${round(left + shoulder)},0 ${round(safeCenter - half * 0.45)},${curveDepth} ${round(safeCenter)},${curveDepth}`,
    `C${round(safeCenter + half * 0.45)},${curveDepth} ${round(right - shoulder)},0 ${round(right)},0`,
    `H${round(width)}`,
    `V${round(height)}`,
    `H0`,
    `Z`,
  ].join(" ");
};

const round = (value: number) => Math.round(value * 100) / 100;
