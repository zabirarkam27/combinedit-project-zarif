import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import useProfileData from "../hooks/useProfileData";
import design from "../styles/design";
import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs || {};
  const profile = useProfileData();
  const [showMobileNav, setShowMobileNav] = useState(false);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // scroll listener (শুধু scroll করলে navbar show হবে)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowMobileNav(true);
      } else {
        setShowMobileNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // double tap anywhere => toggle navbar
useEffect(() => {
  let lastTapTime = 0;

  const handleDoubleTap = () => {
    const currentTime = Date.now();
    const tapInterval = currentTime - lastTapTime;

    if (tapInterval > 0 && tapInterval < 300) {
      setShowMobileNav((prev) => !prev);
      lastTapTime = 0;
    } else {
      lastTapTime = currentTime;
    }
  };

  const handleDoubleClick = () => {
    setShowMobileNav((prev) => !prev);
  };

  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isMobile) {
    // 👉 মোবাইলে double tap
    document.addEventListener("touchstart", handleDoubleTap);
  } else {
    // 👉 ডেস্কটপে double click
    document.addEventListener("dblclick", handleDoubleClick);
  }

  return () => {
    if (isMobile) {
      document.removeEventListener("touchstart", handleDoubleTap);
    } else {
      document.removeEventListener("dblclick", handleDoubleClick);
    }
  };
}, []);



  return (
    <div>
      {/* Large screen Navbar */}
      <div className="hidden md:flex fixed top-0 left-0 w-full bg-[#10b2d7]/75 backdrop-blur-md shadow-sm z-50">
        <div
          className={
            design.navbarContainer +
            " flex items-center justify-between gap-x-12"
          }
        >
          {/* logo */}
          <div className="navbar-start">
            <a className="btn btn-ghost text-xl">
              <img
                src={profile.logo}
                alt="Company Logo"
                className="w-1/3 mx-auto"
              />
            </a>
          </div>

          {/* center */}
          <div className="navbar-center">
            <SlideTabs>
              <TabItem onClick={() => scrollToSection(profileRef)}>
                <Link to="/">Home</Link>
              </TabItem>
              <TabItem onClick={() => scrollToSection(allProductsRef)}>
                All products
              </TabItem>
              <TabItem onClick={() => scrollToSection(contactRef)}>
                Contact Us
              </TabItem>
            </SlideTabs>
          </div>

          {/* right */}
          <div className="navbar-end gap-4 pr-4">
            <Link to="/cart">
              <img src="/nav-icon/cart.png" alt="cart" className="w-8" />
            </Link>
            <a>
              <img
                src="/nav-icon/tracking.png"
                alt="tracking"
                className="w-8"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={showMobileNav ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="block md:hidden fixed bottom-0 left-0 w-full bg-gray-900/40 backdrop-blur-md border-t border-white/20 py-2 shadow-lg z-50"
      >
        <SlideTabs>
          <TabItem onClick={() => scrollToSection(allProductsRef)}>
            <img src="/nav-icon/hamburger.png" alt="Details" className="w-8" />
          </TabItem>
          <TabItem onClick={() => scrollToSection(contactRef)}>
            <img src="/nav-icon/message.png" alt="message" className="w-8" />
          </TabItem>
          <TabItem onClick={() => scrollToSection(profileRef)}>
            <Link to="/">
              <img src="/nav-icon/home.png" alt="home" className="w-8" />
            </Link>
          </TabItem>
          <TabItem>
            <Link to="/cart">
              <img src="/nav-icon/cart.png" alt="cart" className="w-8" />
            </Link>
          </TabItem>
          <TabItem>
            <img src="/nav-icon/tracking.png" alt="tracking" className="w-8" />
          </TabItem>
        </SlideTabs>
      </motion.div>
    </div>
  );
};

// SlideTabs wrapper
const SlideTabs = ({ children }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() =>
        setPosition((pv) => ({
          ...pv,
          opacity: 1,
        }))
      }
      className="relative mx-auto flex w-fit rounded-full bg-transparent p-2"
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { setPosition })
          : child
      )}
      <Cursor position={position} />
    </ul>
  );
};

// TabItem
const TabItem = ({ children, setPosition, onClick }) => {
  const ref = useRef(null);

  const handleActivate = () => {
    if (!ref?.current) return;
    const { width, left } = ref.current.getBoundingClientRect();
    const parentLeft = ref.current.parentElement.getBoundingClientRect().left;

    setPosition({
      left: left - parentLeft,
      width,
      opacity: 1,
    });
  };

  return (
    <li
      ref={ref}
      onMouseEnter={handleActivate}
      onClick={() => {
        handleActivate();
        if (onClick) onClick();
      }}
      onTouchStart={() => {
        handleActivate();
        if (onClick) onClick();
      }}
      className="relative z-10 block cursor-pointer px-4 py-2 text-white font-medium"
    >
      {children}
    </li>
  );
};

// Cursor
const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute z-0 h-12 md:10 rounded-full bg-black/40"
    />
  );
};

export default NavBar;
