import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, Clock3, PackageCheck, ShoppingBag, X } from "lucide-react";
import { useOrdersContext } from "../../context/OrdersContext";

const STORAGE_KEY = "combineditSeenOrderIds";

const getOrderId = (order) => order?._id || order?.orderId || "";

const getStatus = (order) => {
  const status = order?.status?.status || order?.status || "";
  return String(status).toLowerCase();
};

const formatCurrency = (value) => `BDT ${Number(value || 0).toLocaleString("en-US")}`;

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "New order";
};

const getOrderTotal = (order) =>
  Number(
    order?.grandTotal ||
      order?.total ||
      (Array.isArray(order?.items)
        ? order.items.reduce((sum, item) => sum + Number(item.finalPrice || 0), 0)
        : 0)
  );

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, fetchOrders } = useOrdersContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [seenOrders, setSeenOrders] = useState(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) || localStorage.getItem("seenOrders");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (err) {
      console.error("Failed to load seen notification orders:", err);
      return [];
    }
  });

  const pendingOrders = useMemo(
    () => orders.filter((order) => getStatus(order) === "pending"),
    [orders]
  );

  const pendingOrderIds = useMemo(
    () => pendingOrders.map(getOrderId).filter(Boolean),
    [pendingOrders]
  );

  const unseenCount = useMemo(
    () => pendingOrderIds.filter((id) => !seenOrders.includes(id)).length,
    [pendingOrderIds, seenOrders]
  );

  const latestPendingOrders = useMemo(
    () => pendingOrders.slice(0, 10),
    [pendingOrders]
  );

  useEffect(() => {
    if (!isOpen) return;
    fetchOrders?.();
  }, [fetchOrders, isOpen]);

  useEffect(() => {
    const path = location.pathname;
    const shouldClose =
      path === "/dashboard/pending-orders" ||
      path.startsWith("/dashboard/view-order/");

    if (shouldClose) setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (pendingOrderIds.length === 0) return;

    setSeenOrders((prev) =>
      prev.filter((id) => pendingOrderIds.includes(id)).slice(-100)
    );
  }, [pendingOrderIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seenOrders));
      localStorage.removeItem("seenOrders");
    } catch (err) {
      console.error("Failed to save notification state:", err);
    }
  }, [seenOrders]);

  const markAsSeen = useCallback((ids) => {
    const nextIds = ids.filter(Boolean);
    if (nextIds.length === 0) return;

    setSeenOrders((prev) => {
      const next = Array.from(new Set([...prev, ...nextIds])).slice(-100);
      const isSame =
        next.length === prev.length && next.every((id, index) => id === prev[index]);
      return isSame ? prev : next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    markAsSeen(pendingOrderIds);
  }, [isOpen, markAsSeen, pendingOrderIds]);

  const handleOrderClick = (order) => {
    const id = getOrderId(order);
    if (!id) return;

    markAsSeen([id]);
    setIsOpen(false);
    navigate(`/dashboard/view-order/${id}`);
  };

  const handleViewAll = () => {
    markAsSeen(pendingOrderIds);
    setIsOpen(false);
    navigate("/dashboard/pending-orders");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/12 text-white ring-1 ring-white/20 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications${unseenCount ? `, ${unseenCount} new` : ""}`}
        aria-expanded={isOpen}
      >
        <Bell size={23} strokeWidth={2.15} />
        {unseenCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black leading-none text-white ring-2 ring-[var(--theme-primary)]">
            {unseenCount > 99 ? "99+" : unseenCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-[90] mt-3 w-[min(380px,calc(100vw-1rem))] overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
          <div className="theme-gradient px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/18 ring-1 ring-white/25">
                  <PackageCheck size={22} />
                </span>
                <div>
                  <p className="text-sm font-black">Pending orders</p>
                  <p className="mt-0.5 text-xs font-semibold text-white/75">
                    {pendingOrders.length} active, {unseenCount} new
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/14 text-white transition hover:bg-white/24"
                aria-label="Close notifications"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="max-h-[68vh] overflow-y-auto bg-slate-50 p-3">
            {latestPendingOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center">
                <CheckCircle2 className="mx-auto text-emerald-500" size={38} />
                <p className="mt-3 text-sm font-black text-slate-950">No pending orders</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                  New customer orders will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {latestPendingOrders.map((order) => {
                  const id = getOrderId(order);
                  const isSeen = seenOrders.includes(id);
                  const items = Array.isArray(order.items) ? order.items : [];
                  const firstItem = items[0];
                  const image = firstItem?.selectedImage || firstItem?.images?.[0];

                  return (
                    <button
                      key={id}
                      type="button"
                      className={`group flex w-full gap-3 rounded-3xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        isSeen
                          ? "border-slate-100 bg-white text-slate-600"
                          : "border-[var(--theme-primary)]/20 bg-white text-slate-950 ring-1 ring-[var(--theme-primary)]/10"
                      }`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)] ring-1 ring-slate-100">
                        {image ? (
                          <img src={image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ShoppingBag size={22} />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-black">
                              {order.name || "Unnamed customer"}
                            </span>
                            <span className="mt-1 block truncate text-xs font-bold text-slate-500">
                              {order.orderNumber || id}
                            </span>
                          </span>
                          {!isSeen && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={13} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span>{items.length || 1} item{items.length > 1 ? "s" : ""}</span>
                          <span className="text-[var(--theme-primary)]">{formatCurrency(getOrderTotal(order))}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <button
              type="button"
              disabled={pendingOrders.length === 0}
              className="theme-gradient theme-gradient-hover flex h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-45"
              onClick={handleViewAll}
            >
              View All Pending
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
