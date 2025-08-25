import { useRef, useState } from "react";
import { motion } from "framer-motion";

const NavBar = () => {
  return (
    <div className="bg-white/1 py-5">
      <SlideTabs />
    </div>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border-1 border-white p-1"
    >
      <Tab setPosition={setPosition}>
        <img src="/nav-icon/hamburger.png" alt="" className="w-8" />
      </Tab>
      <Tab setPosition={setPosition}>
        <img src="/nav-icon/message.png" alt="" className="w-8" />
      </Tab>
      <Tab setPosition={setPosition}>
        <img src="/nav-icon/home.png" alt="" className="w-8" />
      </Tab>
      <Tab setPosition={setPosition}>
        <img src="/nav-icon/cart.png" alt="" className="w-8" />
      </Tab>
      <Tab setPosition={setPosition}>
        <img src="/nav-icon/tracking.png" alt="" className="w-8" />
      </Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer md:px-5 md:py-2"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
};

export default NavBar;
