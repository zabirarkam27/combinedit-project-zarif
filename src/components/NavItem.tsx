import { memo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  barIconVariants,
  pressTapAnimation,
  pressTapTransition,
} from "./animation";

type NavItemProps = {
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  label: string;
};

const NavItem = ({ icon: Icon, active, onClick, label }: NavItemProps) => {
  return (
    <button
      type="button"
      className="bottom-nav__item"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      <motion.span
        className="bottom-nav__item-icon"
        variants={barIconVariants}
        animate={active ? "hidden" : "visible"}
        whileTap={!active ? pressTapAnimation : undefined}
        transition={pressTapTransition}
      >
        <Icon size={22} strokeWidth={1.95} aria-hidden="true" />
      </motion.span>
    </button>
  );
};

export default memo(NavItem);
