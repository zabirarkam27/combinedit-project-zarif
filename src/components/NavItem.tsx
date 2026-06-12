import { memo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { iconSpring } from "./animation";

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
        animate={{
          opacity: active ? 0 : 1,
          scale: active ? 0.72 : 1,
          y: active ? 8 : 0,
        }}
        transition={iconSpring}
      >
        <Icon size={26} strokeWidth={2.05} />
      </motion.span>
    </button>
  );
};

export default memo(NavItem);
