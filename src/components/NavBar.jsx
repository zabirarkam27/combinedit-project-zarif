import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import design from "../styles/design";
import BottomNav from "./BottomNav";
import GlobalSearch from "./GlobalSearch";
import useProfileData from "../hooks/useProfileData";

const NavBar = ({ refs }) => {
  const { contactRef } = refs || {};
  const [activeMobileItem, setActiveMobileItem] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfileData();
  const logoSrc = profile?.logo || "/nav-icon/logo.png";

  const routeMobileItem = location.pathname.startsWith("/products")
    ? "menu"
    : location.pathname === "/cart"
    ? "swap"
    : location.pathname === "/"
    ? "home"
    : activeMobileItem;
  const currentMobileItem = ["profile"].includes(activeMobileItem)
    ? activeMobileItem
    : routeMobileItem;

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToContact = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(contactRef), 180);
      return;
    }

    scrollToSection(contactRef);
  };

  const handleMobileAction = (item, action) => {
    setActiveMobileItem(item);
    if (action) action();
  };

  const handleBottomNavSelect = (key) => {
    if (key === "home") {
      handleMobileAction("home", goHome);
      return;
    }

    if (key === "menu") {
      handleMobileAction("menu", () => navigate("/products"));
      return;
    }

    if (key === "swap") {
      handleMobileAction("swap", () => navigate("/cart"));
      return;
    }

    handleMobileAction("profile", goToContact);
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4 ${
      isActive
        ? "text-[var(--theme-primary)] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--theme-primary)]"
        : "text-slate-950 hover:text-[var(--theme-primary)]"
    }`;

  const logoMaskStyle = {
    WebkitMask: `url(${logoSrc}) center / contain no-repeat`,
    mask: `url(${logoSrc}) center / contain no-repeat`,
  };

  return (
    <div>
      <div className="fixed left-0 top-0 z-50 hidden w-full border-b border-[var(--theme-border-color)] bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:flex">
        <div
          className={`${design.navbarContainer} flex items-center justify-between gap-5 py-3`}
        >
          <div className="min-w-0 shrink-0">
            <Link
              to="/"
              onClick={goHome}
              className="inline-flex items-center rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
              aria-label="Go to home"
            >
              <span
                className="block h-16 w-20 bg-[var(--theme-logo-color)]"
                style={logoMaskStyle}
              />
            </Link>
          </div>

          <nav className="flex min-w-0 flex-1 items-center justify-center gap-3 text-[13px] font-semibold xl:gap-7 xl:text-[15px]">
            <NavLink to="/" end onClick={goHome} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              All Products
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `${navLinkClass({ isActive })} flex items-center gap-1.5`
              }
            >
              Categories <ChevronDown size={16} strokeWidth={2.4} />
            </NavLink>
            <button
              type="button"
              onClick={goToContact}
              className="py-2 text-slate-950 transition-colors hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
            >
              Contact Us
            </button>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 pr-1 text-slate-950 xl:gap-5 xl:pr-2">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 transition-colors hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
            >
              <Search size={28} strokeWidth={2.1} />
            </button>
            <button
              type="button"
              aria-label="Account"
              className="rounded-full p-2 transition-colors hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
            >
              <UserRound size={28} strokeWidth={2.1} />
            </button>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4 ${
                  isActive ? "text-[var(--theme-cart-icon-color)]" : "hover:text-[var(--theme-primary)]"
                }`
              }
              aria-label="Open cart"
            >
              <ShoppingBag
                className="text-[var(--theme-cart-icon-color)]"
                size={30}
                strokeWidth={2.1}
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 left-7 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--theme-primary)] px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
              <span className="ml-3 text-base font-bold">{"\u09F3"}0</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNav
          activeKey={currentMobileItem}
          onTabSelect={handleBottomNavSelect}
        />
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default NavBar;

