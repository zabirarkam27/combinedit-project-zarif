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
  const x1 = safeCenter - half;
  const x2 = safeCenter + half;

  const shoulder = curveWidth * 0.18;
  const inner = curveWidth * 0.31;
  const floorLift = curveDepth * 0.04;

  return [
    `M 0 0`,
    `L ${x1} 0`,
    `C ${x1 + shoulder} 0 ${x1 + shoulder} ${curveDepth * 0.42} ${
      safeCenter - inner
    } ${curveDepth * 0.64}`,
    `C ${safeCenter - inner * 0.62} ${curveDepth - floorLift} ${
      safeCenter - inner * 0.28
    } ${curveDepth} ${safeCenter} ${curveDepth}`,
    `C ${safeCenter + inner * 0.28} ${curveDepth} ${
      safeCenter + inner * 0.62
    } ${curveDepth - floorLift} ${safeCenter + inner} ${curveDepth * 0.64}`,
    `C ${x2 - shoulder} ${curveDepth * 0.42} ${x2 - shoulder} 0 ${x2} 0`,
    `L ${width} 0`,
    `L ${width} ${height}`,
    `L 0 ${height}`,
    `Z`,
  ].join(" ");
};
