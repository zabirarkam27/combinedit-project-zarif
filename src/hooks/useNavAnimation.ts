import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { CIRCLE_DIAMETER } from "../components/geometry";
import { indicatorSpring, notchSpring } from "../components/animation";

export const useNavAnimation = (
  activeIndex: number,
  itemCount: number,
  navRef: RefObject<HTMLElement>
) => {
  const [navWidth, setNavWidth] = useState(0);
  const targetCenterX = useMotionValue(0);
  const didMeasure = useRef(false);
  const centerX = useSpring(targetCenterX, notchSpring);
  const indicatorCenterX = useSpring(targetCenterX, indicatorSpring);

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

    if (!didMeasure.current) {
      didMeasure.current = true;
      targetCenterX.set(targetCenter);
      centerX.jump(targetCenter);
      indicatorCenterX.jump(targetCenter);
      return;
    }

    targetCenterX.set(targetCenter);
  }, [centerX, indicatorCenterX, targetCenter, targetCenterX]);

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
