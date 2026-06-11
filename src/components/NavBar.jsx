import { useRef, useState } from "react";
import { motion } from "framer-motion";
// import useProfileData from "../hooks/useProfileData";
import design from "../styles/design";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import GlobalSearch from "./GlobalSearch";
import {
  ChevronDown,
  Home,
  List,
  MessageCircle,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const NavBar = ({ refs }) => {
  const { profileRef, allProductsRef, contactRef } = refs || {};
  // const { profile} = useProfileData();
  const [activeMobileItem, setActiveMobileItem] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
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
      <div className="hidden md:flex fixed top-0 left-0 w-full border-b border-[var(--theme-border-color)] bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur z-50">
        <div
          className={
            design.navbarContainer +
            " flex items-center justify-between gap-x-12 py-3"
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
            <nav className="flex items-center gap-9 text-[15px] font-semibold text-slate-950">
              <button
                type="button"
                onClick={() => scrollToSection(profileRef)}
                className="relative py-2 text-[var(--theme-primary)] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--theme-primary)]"
              >
                Home
              </button>
              <Link
                to="/products"
                className="py-2 transition-colors hover:text-[var(--theme-primary)]"
              >
                All Products
              </Link>
              <Link
                to="/categories"
                className="flex items-center gap-1.5 py-2 transition-colors hover:text-[var(--theme-primary)]"
              >
                Categories <ChevronDown size={16} strokeWidth={2.4} />
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection(contactRef)}
                className="py-2 transition-colors hover:text-[var(--theme-primary)]"
              >
                Contact Us
              </button>
            </nav>
          </div>

          {/* navbar end */}
          <div className="navbar-end gap-6 pr-2 flex items-center !justify-center text-slate-950">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="transition-colors hover:text-[var(--theme-primary)]"
            >
              <Search size={28} strokeWidth={2.1} />
            </button>
            <button type="button" aria-label="Account" className="transition-colors hover:text-[var(--theme-primary)]">
              <UserRound size={28} strokeWidth={2.1} />
            </button>
            <Link to="/cart" className="relative flex items-center gap-2 transition-colors hover:text-[var(--theme-primary)]" aria-label="Open cart">
              <ShoppingBag size={30} strokeWidth={2.1} />
              {cartItems.length > 0 && (
                <span className="absolute -top-3 left-5 bg-[var(--theme-primary)] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
              <span className="text-base font-bold">৳0</span>
            </Link>
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
            label="Search"
            icon={Search}
            active={searchOpen}
            onClick={() =>
              handleMobileAction("search", () => setSearchOpen(true))
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

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
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
