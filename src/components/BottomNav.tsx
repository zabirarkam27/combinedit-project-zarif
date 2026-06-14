import { memo, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  PackageSearch,
  Search,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { useNavAnimation } from "../hooks/useNavAnimation";
import {
  CIRCLE_TOP_OFFSET,
  CURVE_DEPTH,
  CURVE_WIDTH,
  NAV_HEIGHT,
} from "./geometry";
import { circleIconVariants } from "./animation";
import SvgNotch from "./SvgNotch";
import NavItem from "./NavItem";
import "./BottomNav.css";

export type BottomNavKey = "home" | "menu" | "swap" | "search";

type BottomNavTab = {
  key: BottomNavKey;
  label: string;
  icon: LucideIcon;
};

type BottomNavProps = {
  activeKey?: BottomNavKey;
  onTabSelect?: (key: BottomNavKey) => void;
};

const tabs: BottomNavTab[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "menu", label: "All Products", icon: PackageSearch },
  { key: "swap", label: "Cart", icon: ShoppingBag },
  { key: "search", label: "Search", icon: Search },
];

const BottomNav = ({ activeKey = "home", onTabSelect }: BottomNavProps) => {
  const [selectedKey, setSelectedKey] = useState<BottomNavKey>(activeKey);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSelectedKey(activeKey);
  }, [activeKey]);

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === selectedKey)
  );
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const ActiveIcon = activeTab.icon;

  const { navWidth, centerX, indicatorX, indicatorTransition } = useNavAnimation(
    activeIndex,
    tabs.length,
    navRef
  );

  const renderedTabs = useMemo(
    () =>
      tabs.map((tab) => (
        <NavItem
          key={tab.key}
          icon={tab.icon}
          label={tab.label}
          active={tab.key === selectedKey}
          onClick={() => {
            setSelectedKey(tab.key);
            onTabSelect?.(tab.key);
          }}
        />
      )),
    [onTabSelect, selectedKey]
  );

  return (
    <nav ref={navRef} className="bottom-nav" aria-label="Mobile bottom navigation">
      <div className="bottom-nav__inner">
        <SvgNotch
          centerX={centerX}
          width={navWidth || 1}
          height={NAV_HEIGHT}
          curveWidth={CURVE_WIDTH}
          curveDepth={CURVE_DEPTH}
        />

        <motion.div
          className="bottom-nav__indicator"
          style={{ x: indicatorX, top: CIRCLE_TOP_OFFSET }}
          transition={indicatorTransition}
          aria-hidden="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeTab.key}
              className="bottom-nav__indicator-icon"
              variants={circleIconVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <ActiveIcon size={26} strokeWidth={2.25} aria-hidden="true" />
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div
          className="bottom-nav__items"
        >
          {renderedTabs}
        </div>
      </div>
    </nav>
  );
};

export default memo(BottomNav);
