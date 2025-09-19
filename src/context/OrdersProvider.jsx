import { useState, useEffect, useCallback } from "react";
import OrdersContext from "./OrdersContext";
import { useOrders } from "../hooks/useOrders";
import usePagination from "../hooks/usePagination";
import api from "../api";

const OrdersProvider = ({ children }) => {
  const { handleStatusUpdate, handleDeleteOrder } = useOrders();
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Filter orders
  const filterOrders = useCallback(() => {
    let data = [...orders];

    if (activeTab !== "all") {
      data = data.filter(
        (o) => (o.status?.status || o.status || "").toLowerCase() === activeTab
      );
    }

    if (search) {
      const query = search.toLowerCase();
      data = data.filter(
        (o) =>
          (o.orderNumber || "").toLowerCase().includes(query) ||
          (o.name || "").toLowerCase().includes(query) ||
          (o.phone || "").toLowerCase().includes(query) ||
          (o.products || "").toLowerCase().includes(query)
      );
    }

    if (fromDate) {
      const from = new Date(fromDate);
      data = data.filter((o) => new Date(o.createdAt) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      data = data.filter((o) => new Date(o.createdAt) <= to);
    }

    setFilteredOrders(data);
  }, [orders, activeTab, search, fromDate, toDate]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders?limit=50");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders?limit=50");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
    setSelectedOrders([]);
  }, [orders, activeTab, search, fromDate, toDate, filterOrders]);

  // Status update
  const updateOrderStatus = async (id, orderStatus, paymentStatus) => {
    try {
      await handleStatusUpdate(id, orderStatus, paymentStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                status: { ...(o.status || {}), status: orderStatus },
                paymentStatus,
              }
            : o
        )
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    try {
      await handleDeleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  const getOrderCountByStatus = (status) => {
    if (status === "all") return orders.length;
    return orders.filter(
      (o) => (o.status?.status || o.status || "").toLowerCase() === status
    ).length;
  };

  const getTodaysOrdersCount = () => {
    const today = new Date();
    return orders.filter(
      (o) =>
        new Date(o.createdAt).toLocaleDateString() ===
        today.toLocaleDateString()
    ).length;
  };

  const getPendingOrdersCount = () => getOrderCountByStatus("pending");
  const getProcessingOrdersCount = () => getOrderCountByStatus("processing");
  const getCompletedOrdersCount = () => getOrderCountByStatus("completed");
  const getCanceledOrdersCount = () => getOrderCountByStatus("cancelled");

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    setCurrentPage,
  } = usePagination(filteredOrders, 15);

  const contextValue = {
    orders,
    setOrders,
    fetchOrders,
    filteredOrders,
    selectedOrders,
    setSelectedOrders,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    getOrderCountByStatus,
    getTodaysOrdersCount,
    getPendingOrdersCount,
    getProcessingOrdersCount,
    getCompletedOrdersCount,
    getCanceledOrdersCount,
    handleStatusUpdate: updateOrderStatus,
    handleDeleteOrder: deleteOrder,
    // pagination
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    setCurrentPage,
  };

  return (
    <OrdersContext.Provider value={contextValue}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersProvider;
