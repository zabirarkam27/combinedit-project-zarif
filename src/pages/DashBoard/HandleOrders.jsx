import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { Buffer } from "buffer";

import OrdersContext from "../../context/OrdersContext";
import { useOrders } from "../../hooks/useOrders";
import usePagination from "../../hooks/usePagination";
import InvoiceDocument from "./InvoiceDocument";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
window.Buffer = Buffer;

const HandleOrders = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const { orders, handleStatusUpdate, handleDeleteOrder } = useOrders();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(status || "all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Filter orders
  const filterOrders = useCallback(() => {
    let data = [...orders];

    if (status || activeTab !== "all") {
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

  // Order count by status
  const getOrderCountByStatus = (status) => {
    if (status === "all") {
      return orders.length;
    }
    // Specific status count
    return orders.filter(
      (o) => (o.status?.status || o.status || "").toLowerCase() === status
    ).length;
  };

  // ✅ Today's Orders Count
  const getTodaysOrdersCount = () => {
    const today = new Date();
    return orders.filter(
      (o) =>
        new Date(o.createdAt).toLocaleDateString() ===
        today.toLocaleDateString()
    ).length;
  };

  // ✅ Additional functions required by DashItems
  const getPendingOrdersCount = () => {
    return orders.filter(
      (o) => (o.status?.status || o.status || "").toLowerCase() === "pending"
    ).length;
  };

  const getProcessingOrdersCount = () => {
    return orders.filter(
      (o) => (o.status?.status || o.status || "").toLowerCase() === "processing"
    ).length;
  };

  const getCompletedOrdersCount = () => {
    return orders.filter(
      (o) => (o.status?.status || o.status || "").toLowerCase() === "completed"
    ).length;
  };

  const getCanceledOrdersCount = () => {
    return orders.filter(
      (o) => (o.status?.status || o.status || "").toLowerCase() === "cancelled"
    ).length;
  };

  // ✅ Context value for the table part
  const contextValue = {
    orders,
    filteredOrders,
    getOrderCountByStatus,
    getTodaysOrdersCount,
    getPendingOrdersCount,
    getProcessingOrdersCount,
    getCompletedOrdersCount,
    getCanceledOrdersCount,
    handleStatusUpdate,
    handleDeleteOrder,
    selectedOrders,
    setSelectedOrders,
  };

  // Tabs with count
  const statusTabs = [
    { label: "all", display: "All" },
    { label: "pending", display: "Pending" },
    { label: "processing", display: "Processing" },
    { label: "pickup", display: "Pickup" },
    { label: "completed", display: "Completed" },
    { label: "cancelled", display: "Cancelled" },
  ];

  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    setCurrentPage,
  } = usePagination(filteredOrders, 15);

  // ✅ Select all / single
  const toggleSelectAll = (e) => {
    setSelectedOrders(
      e.target.checked ? paginatedData.map((o) => o.orderId) : []
    );
  };

  const toggleSelectOne = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // ✅ Bulk status update
  const handleBulkAction = async (status) => {
    if (!selectedOrders.length) {
      toast.error("⚠️ No orders selected!");
      return;
    }

    await Promise.all(
      selectedOrders.map((id) => handleStatusUpdate(id, status))
    );

    toast.success(`✅ Order status changed to ${status}`);
    setSelectedOrders([]);
    filterOrders();
    setCurrentPage(1);
  };

  // ✅ Helper to safely get string
  const getString = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      return value.status || value.paymentStatus || "Unknown";
    }
    return "Unknown";
  };

  // ✅ Selected orders for PDF
  const selectedOrderData = filteredOrders.filter((o) =>
    selectedOrders.includes(o.orderId)
  );

  // ✅ Export selected orders to Excel
  const exportToExcel = () => {
    if (!selectedOrders.length) {
      toast.error("⚠️ No orders selected!");
      return;
    }

    const selectedData = selectedOrderData.map((order) => ({
      OrderNumber: order.orderNumber,
      CustomerName: order.name,
      CustomerPhone: order.phone,
      ProductDetails: order.items
        .map((item) => `${item.productName} (${item.quantity})`)
        .join(", "),
      ShippingCharge: order.shippingCharge,
      TotalAmount: order.grandTotal,
      PaymentMethod: order.paymentMethod,
      PaymentStatus: order.paymentStatus,
      OrderStatus: order.status,
      DatePlaced: new Date(order.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Create and download Excel file
    XLSX.writeFile(wb, "selected_orders.xlsx");
  };

  // ✅ Delete an order
  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      handleDeleteOrder(orderId);
      toast.success("✅ Order deleted successfully");
    }
  };

  return (
    <div className="w-full mx-auto p-1 md:p-4 bg-[#ebf0f0] shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-black my-10">
          Placed Orders
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          {/* Single PDF Download */}
          {paginatedData.length === 1 && (
            <PDFDownloadLink
              document={<InvoiceDocument order={paginatedData[0]} />}
              fileName={`invoice_${paginatedData[0].orderNumber}.pdf`}
            >
              {({ loading }) => (
                <button className="btn btn-sm btn-success">
                  {loading ? "Generating..." : "Download Single PDF"}
                </button>
              )}
            </PDFDownloadLink>
          )}

          {/* Merged PDF Download for selected */}
          {selectedOrders.length > 0 && (
            <PDFDownloadLink
              document={<InvoiceDocument orders={selectedOrderData} />}
              fileName="merged_invoices.pdf"
            >
              {({ loading }) => (
                <button className="btn btn-sm btn-info">
                  {loading ? "Generating..." : "Print Selected"}
                </button>
              )}
            </PDFDownloadLink>
          )}

          {/* Excel Download for selected */}
          {selectedOrders.length > 0 && (
            <button className="btn btn-sm btn-primary" onClick={exportToExcel}>
              Download Excel
            </button>
          )}

          {/* Print button fallback */}
          {selectedOrders.length === 0 && paginatedData.length !== 1 && (
            <button
              className="btn btn-sm btn-info"
              onClick={() =>
                toast.error("⚠️ Select orders or single order first!")
              }
            >
              Print
            </button>
          )}
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-2">
        {/* Tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                activeTab === tab.label
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab.display} ({getOrderCountByStatus(tab.label)})
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex gap-2">
          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">From Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-xs mb-1">To Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Search + Bulk Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <select
          className="select select-bordered w-full md:w-40"
          defaultValue=""
          onChange={(e) => e.target.value && handleBulkAction(e.target.value)}
        >
          <option value="" disabled>
            Select Action
          </option>
          {["pending", "processing", "pickup", "completed", "cancelled"].map(
            (status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            )
          )}
        </select>
        <input
          type="text"
          placeholder="Search by Order number or name"
          className="input input-bordered w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table wrapped in Context */}
      <OrdersContext.Provider value={contextValue}>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead>
              <tr className="bg-base-200">
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    onChange={toggleSelectAll}
                    checked={
                      paginatedData.length > 0 &&
                      selectedOrders.length === paginatedData.length
                    }
                  />
                </th>
                <th>Order#</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Shipping</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Pay Status</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length ? (
                paginatedData.map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedOrders.includes(order.orderId)}
                        onChange={() => toggleSelectOne(order.orderId)}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/dashboard/view-order/${order.orderId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{order.name}</td>
                    <td>BDT {order.shippingCharge}</td>
                    <td>BDT {order.grandTotal}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          getString(order.paymentStatus) === "pending"
                            ? "bg-yellow-500"
                            : getString(order.paymentStatus) === "completed"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {getString(order.paymentStatus)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          getString(order.status) === "pending"
                            ? "bg-yellow-500"
                            : getString(order.status) === "processing"
                            ? "bg-blue-500"
                            : getString(order.status) === "pickup"
                            ? "bg-purple-500"
                            : getString(order.status) === "completed"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {getString(order.status)}
                      </span>
                    </td>
                    <td className="align-middle">
                      {/* Individual PDF download */}
                      <div className="flex flex-row gap-3 items-center">
                        <PDFDownloadLink
                          document={<InvoiceDocument order={order} />}
                          fileName={`invoice_${order.orderNumber}.pdf`}
                        >
                          {({ loading }) => (
                            <img
                              src="/print-dash.png"
                              alt="invoice"
                              className="w-6 max-w-6 cursor-pointer"
                            />
                          )}
                        </PDFDownloadLink>
                        {/* Edit */}
                        <img
                          src="/edit-dash.png"
                          alt="edit"
                          className="w-6 max-w-6 cursor-pointer"
                          onClick={() =>
                            navigate(`/dashboard/view-order/${order.orderId}`)
                          }
                        />
                        {/* Delete */}
                        <img
                          src="/delete-dash.png"
                          alt="delete"
                          className="w-5 max-w-5 cursor-pointer"
                          onClick={() => handleDelete(order.orderId)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center">
                    No {activeTab} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            className="btn btn-xs"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-xs"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </OrdersContext.Provider>
      <ToastContainer />
    </div>
  );
};

export default HandleOrders;
