import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrdersContext } from "../../context/OrdersContext";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useOrdersContext(); // Context থেকে orders

  const [isOpen, setIsOpen] = useState(false);

  // ✅ Seen orders lazy-loaded from localStorage
  const [seenOrders, setSeenOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("seenOrders");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load seenOrders from localStorage:", err);
      return [];
    }
  });

  const dropdownRef = useRef(null);

  // ✅ Pending orders memoized
  const pendingOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = order?.status?.status || order?.status || "";
      return status.toLowerCase() === "pending";
    });
  }, [orders]);

  const lastTenOrders = useMemo(
    () => pendingOrders.slice(0, 10),
    [pendingOrders]
  );

  // ✅ Route change effect: close dropdown on specific paths
  useEffect(() => {
    const path = location.pathname;
    const closePaths = ["/dashboard/pending-orders"];
    const isViewOrderPath = path.startsWith("/dashboard/view-order/");
    if (closePaths.includes(path) || isViewOrderPath) setIsOpen(false);
  }, [location]);

  // ✅ Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Save seenOrders to localStorage efficiently
  useEffect(() => {
    try {
      localStorage.setItem("seenOrders", JSON.stringify(seenOrders));
    } catch (err) {
      console.error("Failed to save seenOrders:", err);
    }
  }, [seenOrders]);

  // ✅ Order click handler
  const handleOrderClick = (id) => {
    navigate(`/dashboard/view-order/${id}`);
    setSeenOrders((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setIsOpen(false);
  };

  const handleViewAll = () => {
    navigate("/dashboard/pending-orders");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell icon */}
      <button
        className="btn btn-ghost bg-transparent border-none hover:bg-transparent p-0 indicator"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="w-7 relative">
          <img src="/nav-icon/notification.png" alt="bell icon" />
          {pendingOrders.length > 0 && (
            <span className="badge badge-xs badge-primary indicator-item">
              {pendingOrders.length}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <ul className="menu menu-sm absolute right-0 bg-base-100 rounded-box z-10 mt-3 w-72 p-2 shadow">
          {lastTenOrders.length === 0 ? (
            <li className="p-2 text-center text-gray-500">No pending orders</li>
          ) : (
            lastTenOrders.map((o) => {
              const isSeen = seenOrders.includes(o._id);
              return (
                <li key={o._id}>
                  <a
                    className={`flex gap-1 cursor-pointer p-1 rounded ${
                      isSeen ? "bg-gray-100 text-gray-500" : "bg-white"
                    }`}
                    onClick={() => handleOrderClick(o._id)}
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=7819&format=png&color=737373"
                      alt="profile icon"
                      className="w-8"
                    />
                    <div className="flex flex-col gap-0.5 items-start mb-1">
                      <p className="text-sm">{o.name}</p>
                      <p className="text-xs text-gray-500">{o.orderNumber}</p>
                    </div>
                  </a>
                </li>
              );
            })
          )}

          {pendingOrders.length > 0 && (
            <li>
              <button
                className="btn btn-sm btn-primary w-full mt-2"
                onClick={handleViewAll}
              >
                View All
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;
