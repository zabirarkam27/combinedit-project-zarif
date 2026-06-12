import { RefObject, useEffect, useMemo, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { CIRCLE_DIAMETER } from "../components/geometry";
import { indicatorSpring, notchSpring } from "../components/animation";

export const useNavAnimation = (
  activeIndex: number,
  itemCount: number,
  navRef: RefObject<HTMLElement>
) => {
  const [navWidth, setNavWidth] = useState(0);
  const centerX = useMotionValue(0);
  const indicatorCenterX = useMotionValue(0);

  useEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const updateWidth = () => setNavWidth(node.getBoundingClientRect().width);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);

    return () => observer.disconnect();
  }, [navRef]);

  const tabWidth = useMemo(
    () => (itemCount > 0 && navWidth > 0 ? navWidth / itemCount : 0),
    [itemCount, navWidth]
  );

  const targetCenter = useMemo(
    () => tabWidth * activeIndex + tabWidth / 2,
    [activeIndex, tabWidth]
  );

  useEffect(() => {
    if (!targetCenter) return;

    const notchControls = animate(centerX, targetCenter, notchSpring);
    const indicatorControls = animate(
      indicatorCenterX,
      targetCenter,
      indicatorSpring
    );

    return () => {
      notchControls.stop();
      indicatorControls.stop();
    };
  }, [centerX, indicatorCenterX, targetCenter]);

  const indicatorX = useTransform(
    indicatorCenterX,
    (value) => value - CIRCLE_DIAMETER / 2
  );

  return {
    navWidth,
    tabWidth,
    centerX,
    indicatorX,
    targetCenter,
    indicatorTransition: indicatorSpring,
  };
};
