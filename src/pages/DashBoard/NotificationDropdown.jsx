import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders?limit=50"); 
        const pendingOrders = response.data.filter(
          (order) => order.status === "pending"
        );
        setOrders(pendingOrders); 
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/dashboard/view-order/${orderId}`);
  };

  const handleViewAll = () => {
    navigate("/dashboard/pending-orders");
  };

  const lastTenOrders = orders.slice(0, 10);

  return (
    <div className="dropdown dropdown-end">
      {/* Bell icon */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent p-0 indicator"
      >
        <div className="w-7 relative">
          <img src="/nav-icon/notification.png" alt="bell icon" />
          {/* Pending order count */}
          {orders.length > 0 && (
            <span className="badge badge-xs badge-primary indicator-item">
              {orders.length} 
            </span>
          )}
        </div>
      </div>

      {/* Dropdown content */}
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-72 p-2 shadow"
      >
        {loading ? (
          <li className="p-2 text-center text-gray-500">Loading...</li>
        ) : orders.length === 0 ? (
          <li className="p-2 text-center text-gray-500">No pending orders</li>
        ) : (
          lastTenOrders.map((order, index) => (
            <li key={order._id || index}>
              <a
                className="flex GAP-1 cursor-pointer"
                onClick={() => handleOrderClick(order._id)}
              >
                <img
                  src="https://img.icons8.com/?size=100&id=7819&format=png&color=737373"
                  alt="profile icon"
                  className="w-8"
                />
                <div className="flex-col gap-0.5 items-start mb-1">
                  <p className="text-sm">{order.name}</p>
                  <p className="text-xs text-gray-500">{order.orderNumber}</p>
                </div>
              </a>
            </li>
          ))
        )}

        {/* View All button */}
        {orders.length > 0 && (
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
    </div>
  );
};

export default NotificationDropdown;
