import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrdersContext } from "../../context/OrdersContext";

const STORAGE_KEY = "combineditSeenOrderIds";

const getOrderId = (order) => order?._id || order?.orderId || "";

const getStatus = (order) => {
  const status = order?.status?.status || order?.status || "";
  return String(status).toLowerCase();
};

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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        className="btn btn-ghost bg-transparent border-none hover:bg-transparent p-0 indicator"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications${unseenCount ? `, ${unseenCount} new` : ""}`}
        aria-expanded={isOpen}
      >
        <div className="w-7 relative">
          <img src="/nav-icon/notification.png" alt="" />
          {unseenCount > 0 && (
            <span className="badge badge-xs badge-primary indicator-item">
              {unseenCount > 99 ? "99+" : unseenCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="menu menu-sm absolute right-0 bg-base-100 rounded-box z-50 mt-3 w-80 max-w-[calc(100vw-2rem)] p-2 shadow-xl border border-base-200">
          <div className="px-2 py-1 flex items-center justify-between">
            <p className="font-semibold text-sm text-[#0c2955]">Pending orders</p>
            <p className="text-xs text-gray-500">
              {pendingOrders.length} total
            </p>
          </div>

          {latestPendingOrders.length === 0 ? (
            <p className="p-3 text-center text-sm text-gray-500">
              No pending orders
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {latestPendingOrders.map((order) => {
                const id = getOrderId(order);
                const isSeen = seenOrders.includes(id);

                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`w-full flex gap-2 cursor-pointer p-2 rounded text-left transition ${
                        isSeen
                          ? "bg-gray-50 text-gray-500"
                          : "bg-[#e9fbf8] text-[#0c2955]"
                      }`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <span
                        className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                          isSeen ? "bg-gray-300" : "bg-[#00ad9c]"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {order.name || "Unnamed customer"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {order.orderNumber || id}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {pendingOrders.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-primary w-full mt-2"
              onClick={handleViewAll}
            >
              View All Pending
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
