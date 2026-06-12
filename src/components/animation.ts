import type { Transition, Variants } from "framer-motion";

export const indicatorSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 35,
  mass: 0.86,
};

export const notchSpring = {
  type: "spring" as const,
  stiffness: 440,
  damping: 34,
  mass: 0.9,
};

export const iconSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 26,
  mass: 0.7,
};

export const iconFadeTransition: Transition = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1],
};

export const circleIconVariants: Variants = {
  enter: {
    opacity: 0,
    scale: 0.4,
    rotate: -45,
  },
  center: {
    opacity: 1,
    scale: 1.15,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.4,
    rotate: 45,
    transition: { duration: 0.15 },
  },
};

export const barIconVariants: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: iconFadeTransition,
  },
  hidden: {
    opacity: 0,
    scale: 0.6,
    y: 8,
    transition: iconFadeTransition,
  },
};

export const pressTapAnimation = { scale: 0.88 };

export const pressTapTransition: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 30,
};
