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
  const path = useTransform(centerX, (value) =>
    buildNotchPath(value, width || 1, height, curveWidth, curveDepth)
  );

  return (
    <svg
      className="bottom-nav__shape"
      viewBox={`0 0 ${width || 1} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path d={path} fill="white" />
    </svg>
  );
};

export default memo(SvgNotch);
