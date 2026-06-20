import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import design from "../styles/design";
import BottomNav from "./BottomNav";
import GlobalSearch from "./GlobalSearch";
import useProfileData from "../hooks/useProfileData";
import { readCustomerOrderHistory } from "../utils/customerOrderHistory";

const formatCurrency = (value) => `BDT ${Number(value || 0).toLocaleString("en-US")}`;

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Recent order";
};

const NavBar = ({ refs }) => {
  const { contactRef } = refs || {};
  const [searchOpen, setSearchOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const orderHistoryRef = useRef(null);
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfileData();
  const logoSrc = profile?.logo || "/nav-icon/logo.png";

  useEffect(() => {
    const syncOrderHistory = () => setOrderHistory(readCustomerOrderHistory());
    syncOrderHistory();
    window.addEventListener("storage", syncOrderHistory);
    window.addEventListener("customer-orders-updated", syncOrderHistory);
    return () => {
      window.removeEventListener("storage", syncOrderHistory);
      window.removeEventListener("customer-orders-updated", syncOrderHistory);
    };
  }, []);

  useEffect(() => {
    setOrderHistoryOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!orderHistoryOpen) return undefined;

    const handlePointerDown = (event) => {
      if (orderHistoryRef.current && !orderHistoryRef.current.contains(event.target)) {
        setOrderHistoryOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOrderHistoryOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [orderHistoryOpen]);

  const orderedProductCount = useMemo(
    () => orderHistory.reduce((sum, order) => sum + (order.items?.length || 0), 0),
    [orderHistory]
  );

  const routeMobileItem = location.pathname.startsWith("/products") || location.pathname.startsWith("/categories")
    ? "menu"
    : location.pathname === "/cart"
    ? "swap"
    : location.pathname === "/"
    ? "home"
    : "home";
  const currentMobileItem = searchOpen ? "search" : routeMobileItem;

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

  const handleBottomNavSelect = (key) => {
    if (key === "home") {
      setSearchOpen(false);
      goHome();
      return;
    }

    if (key === "menu") {
      setSearchOpen(false);
      navigate("/products");
      return;
    }

    if (key === "swap") {
      setSearchOpen(false);
      navigate("/cart");
      return;
    }

    setSearchOpen(true);
  };

  const openProduct = (productId) => {
    if (!productId) return;
    setOrderHistoryOpen(false);
    navigate(`/products/${productId}`);
  };

  const navLinkClass = ({ isActive }) =>
    `relative inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4 ${
      isActive
        ? "bg-[var(--theme-primary)] text-white shadow-[0_14px_30px_rgba(11,125,35,0.18)]"
        : "text-slate-700 hover:bg-[var(--theme-muted-bg)] hover:text-[var(--theme-primary)]"
    }`;

  const logoMaskStyle = {
    WebkitMask: `url(${logoSrc}) center / contain no-repeat`,
    mask: `url(${logoSrc}) center / contain no-repeat`,
  };

  return (
    <div>
      <div className="fixed left-0 top-0 z-50 hidden w-full border-b border-white/70 bg-white/82 shadow-[0_18px_55px_rgba(15,23,42,0.10)] backdrop-blur-xl md:flex">
        <div
          className={`${design.navbarContainer} flex items-center justify-between gap-5 py-3`}
        >
          <div className="min-w-0 shrink-0">
            <Link
              to="/"
              onClick={goHome}
              className="inline-flex h-14 items-center rounded-[22px] border border-[var(--theme-border-color)] bg-white px-3 shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
              aria-label="Go to home"
            >
              <span
                className="block h-11 w-[76px] bg-[var(--theme-logo-color)]"
                style={logoMaskStyle}
              />
            </Link>
          </div>

          <nav className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-[24px] border border-[var(--theme-border-color)] bg-white/75 p-1.5 shadow-inner shadow-slate-100/70">
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
              Categories
            </NavLink>
            <button
              type="button"
              onClick={goToContact}
              className="relative inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-black text-slate-700 transition-all duration-200 hover:bg-[var(--theme-muted-bg)] hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
            >
              Contact Us
            </button>
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-2 text-slate-950 xl:gap-3">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--theme-border-color)] bg-white text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
            >
              <Search size={24} strokeWidth={2.15} />
            </button>
            <div ref={orderHistoryRef} className="relative">
              <button
                type="button"
                aria-label="View ordered products"
                aria-expanded={orderHistoryOpen}
                onClick={() => setOrderHistoryOpen((open) => !open)}
                className="relative grid h-12 w-12 place-items-center rounded-2xl border border-[var(--theme-border-color)] bg-white text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4"
              >
                <UserRound size={24} strokeWidth={2.15} />
                {orderedProductCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-white">
                    {orderedProductCount > 9 ? "9+" : orderedProductCount}
                  </span>
                )}
              </button>

              {orderHistoryOpen && (
                <div className="absolute right-0 top-12 z-[70] w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-3xl border border-[var(--theme-border-color)] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-[var(--theme-muted-bg)] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--theme-primary)] shadow-sm">
                        <PackageCheck size={20} />
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-950">Ordered Products</p>
                        <p className="text-xs font-semibold text-slate-500">Saved in this browser</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOrderHistoryOpen(false)}
                      className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950"
                      aria-label="Close ordered products"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto p-3">
                    {orderHistory.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                        <PackageCheck className="mx-auto text-slate-300" size={36} />
                        <p className="mt-3 text-sm font-black text-slate-900">No ordered products yet</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                          After placing an order, products will appear here on this browser.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orderHistory.map((order) => (
                          <section key={order.id} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
                              <span className="inline-flex items-center gap-1.5">
                                <Clock3 size={14} />
                                {formatDate(order.createdAt)}
                              </span>
                              <span className="rounded-full bg-[var(--theme-muted-bg)] px-2 py-1 text-[var(--theme-primary)]">
                                {order.orderNumber || order.id}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {(order.items || []).map((item, index) => (
                                <button
                                  key={`${order.id}-${item.productId || item.productName}-${index}`}
                                  type="button"
                                  onClick={() => openProduct(item.productId)}
                                  className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-2 text-left transition hover:bg-[var(--theme-muted-bg)] disabled:cursor-default"
                                  disabled={!item.productId}
                                >
                                  <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
                                    {item.selectedImage ? (
                                      <img src={item.selectedImage} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                      <ShoppingBag size={20} className="text-slate-300" />
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-black text-slate-950">
                                      {item.productName}
                                    </span>
                                    <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                                      <span>Qty {item.quantity}</span>
                                      {item.variation && <span>{item.variation}</span>}
                                      {item.color && (
                                        <span className="inline-flex items-center gap-1">
                                          <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                                          Color
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                  <span className="shrink-0 text-xs font-black text-[var(--theme-primary)]">
                                    {formatCurrency(item.finalPrice || item.unitPrice * item.quantity)}
                                  </span>
                                </button>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                              <span className="font-bold text-slate-500">Order total</span>
                              <span className="font-black text-slate-950">{formatCurrency(order.grandTotal)}</span>
                            </div>
                          </section>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex h-12 items-center gap-2 rounded-2xl border px-3 shadow-[0_10px_24px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-4 ${
                  isActive
                    ? "border-[var(--theme-primary)] bg-[var(--theme-muted-bg)] text-[var(--theme-cart-icon-color)]"
                    : "border-[var(--theme-border-color)] bg-white hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
                }`
              }
              aria-label="Open cart"
            >
              <ShoppingBag
                className="text-[var(--theme-cart-icon-color)]"
                size={25}
                strokeWidth={2.15}
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 left-7 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--theme-primary)] px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
              <span className="text-sm font-black text-slate-900">{"\u09F3"}0</span>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="md:hidden">
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
