import { memo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import { buildNotchPath } from "./geometry";

type SvgNotchProps = {
  centerX: MotionValue<number>;
  width: number;
  height: number;
  curveWidth: number;
  curveDepth: number;
};

const SvgNotch = ({
  centerX,
  width,
  height,
  curveWidth,
  curveDepth,
}: SvgNotchProps) => {
  const safeWidth = width || 1;

  const path = useTransform(centerX, (value) =>
    buildNotchPath(value, safeWidth, height, curveWidth, curveDepth)
  );

  if (width <= 0) return null;

  return (
    <svg
      className="bottom-nav__shape"
      width={safeWidth}
      height={height}
      viewBox={`0 0 ${safeWidth} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path d={path} fill="var(--bottom-nav-bg)" />
    </svg>
  );
};

export default memo(SvgNotch);
