import { useState, useEffect, useCallback } from "react";
import OrdersContext from "./OrdersContext";
import { useOrders } from "../hooks/useOrders";
import usePagination from "../hooks/usePagination";
import { toast } from "react-toastify";

const OrdersProvider = ({ children }) => {
  const { orders, handleStatusUpdate, handleDeleteOrder } = useOrders();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Filter orders
  const filterOrders = useCallback(() => {
    let data = [...orders];

    if (activeTab !== "all") {
      data = data.filter(
        (o) => (o.status?.status || o.status || "").toLowerCase() === activeTab
      );
    }

    if (search) {
      const query = search.toLowerCase();
      data = data.filter((o) => {
        return (
          (o.orderNumber || "").toLowerCase().includes(query) ||
          (o.name || "").toLowerCase().includes(query) ||
          (o.phone || "").toLowerCase().includes(query) ||
          (o.products || "").toLowerCase().includes(query)
        );
      });
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

  useEffect(() => {
    filterOrders();
    setSelectedOrders([]);
  }, [orders, activeTab, search, fromDate, toDate, filterOrders]);

  // ✅ Status counters
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

  // ✅ Pagination hook
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
    handleStatusUpdate,
    handleDeleteOrder,
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
