import { useRef, useState } from "react";
import { motion } from "framer-motion";
// import useProfileData from "../hooks/useProfileData";
import design from "../styles/design";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Grid2X2,
  Home,
  List,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

const NavBar = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs || {};
  // const { profile} = useProfileData();
  const [activeMobileItem, setActiveMobileItem] = useState("home");
  const { cartItems } = useCart();
  const location = useLocation();

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMobileAction = (item, action) => {
    setActiveMobileItem(item);
    if (action) action();
  };

  const currentMobileItem =
    location.pathname === "/cart" ? "cart" : activeMobileItem;

  return (
    <div>
      {/* Large screen Navbar */}
      <div className="hidden md:flex fixed top-0 left-0 w-full shadow-lg theme-gradient theme-gradient-hover z-50">
        <div
          className={
            design.navbarContainer +
            " flex items-center justify-between gap-x-12"
          }
        >
          {/* logo */}
          <div className="navbar-start">
            <Link
              to="/"
              className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent hover:border-none hover:shadow-none focus:outline-none active:bg-transparent p-0"
              aria-label="Go to home"
            >
              <img
                src="/nav-icon/logo.png"
                alt="Company Logo"
                className="w-16 mx-auto"
              />
            </Link>
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

          {/* navbar end */}
          <div className="navbar-end gap-4 pr-4 flex items-center !justify-center">
            <Link to="/cart" className="relative" aria-label="Open cart">
              <img src="/nav-icon/cart.png" alt="cart" className="w-8" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c40000] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button type="button" aria-label="Track order" className="p-0">
              <img
                src="/nav-icon/tracking.png"
                alt="tracking"
                className="w-8"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <motion.div
        initial={{ x: "-50%", y: 96, opacity: 0, scale: 0.96 }}
        animate={{ x: "-50%", y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mobile-nav-wrap md:hidden"
      >
        <nav className="mobile-nav-shell" aria-label="Mobile primary navigation">
          <MobileNavButton
            label="Profile"
            icon={Grid2X2}
            active={currentMobileItem === "profile"}
            onClick={() =>
              handleMobileAction("profile", () => scrollToSection(profileRef))
            }
          />
          <MobileNavButton
            label="Products"
            icon={List}
            active={currentMobileItem === "products"}
            onClick={() =>
              handleMobileAction("products", () => scrollToSection(allProductsRef))
            }
          />

          <Link
            to="/"
            aria-label="Home"
            onClick={() =>
              handleMobileAction("home", () => scrollToSection(profileRef))
            }
            className="mobile-nav-center"
          >
            <motion.span
              animate={{
                rotate: currentMobileItem === "home" ? 0 : -18,
                scale: currentMobileItem === "home" ? 1.05 : 1,
              }}
              whileTap={{ scale: 0.9, rotate: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="mobile-nav-center-inner"
            >
              <Home size={24} strokeWidth={2.4} />
            </motion.span>
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            onClick={() => handleMobileAction("cart")}
            className={`mobile-nav-item ${currentMobileItem === "cart" ? "is-active" : ""}`}
          >
            <motion.span
              whileTap={{ y: -3, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="mobile-nav-icon-wrap"
            >
              <ShoppingBag size={25} strokeWidth={2.1} />
              {cartItems.length > 0 && (
                <span className="mobile-nav-badge">{cartItems.length}</span>
              )}
            </motion.span>
            <span className="sr-only">Cart</span>
          </Link>
          <MobileNavButton
            label="Contact"
            icon={MessageCircle}
            active={currentMobileItem === "contact"}
            onClick={() =>
              handleMobileAction("contact", () => scrollToSection(contactRef))
            }
          />
        </nav>
      </motion.div>
    </div>
  );
};

const MobileNavButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    type="button"
    aria-label={label}
    aria-current={active ? "page" : undefined}
    onClick={onClick}
    className={`mobile-nav-item ${active ? "is-active" : ""}`}
  >
    <motion.span
      whileTap={{ y: -3, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className="mobile-nav-icon-wrap"
    >
      <Icon size={25} strokeWidth={2.1} />
    </motion.span>
    <span className="sr-only">{label}</span>
  </button>
);

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
          opacity: 0,
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
      className="absolute z-0 h-12 md:h-10 rounded-full bg-black/40"
    />
  );
};

export default NavBar;
