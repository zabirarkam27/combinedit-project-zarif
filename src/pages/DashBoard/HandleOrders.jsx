import { useState, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Buffer } from "buffer";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  Eye,
  FileText,
  PackageCheck,
  Printer,
  Search,
  Trash2,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

import OrdersContext from "../../context/OrdersContext";
import { useOrders } from "../../hooks/useOrders";
import usePagination from "../../hooks/usePagination";
import InvoiceDocument from "./InvoiceDocument";
import { downloadCsv } from "../../utils/csv";
import { confirmPopup } from "../../utils/popups";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

window.Buffer = Buffer;

const statusTabs = [
  { label: "all", display: "All", icon: ClipboardList },
  { label: "pending", display: "Pending", icon: CalendarDays },
  { label: "processing", display: "Processing", icon: PackageCheck },
  { label: "pickup", display: "Pickup", icon: Truck },
  { label: "completed", display: "Completed", icon: CheckCircle2 },
  { label: "cancelled", display: "Cancelled", icon: XCircle },
];

const bulkStatuses = ["pending", "processing", "pickup", "completed", "cancelled"];

const HandleOrders = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const { orders, handleStatusUpdate, handleDeleteOrder } = useOrders();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(status || "all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const tableScrollRef = useRef(null);
  const stickyScrollRef = useRef(null);
  const syncingScrollRef = useRef(false);

  const getString = useCallback((value) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      return value.status || value.paymentStatus || "Unknown";
    }
    return "Unknown";
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab !== "all") {
        const orderStatus = getString(order.status).toLowerCase();
        if (orderStatus !== activeTab) return false;
      }

      if (search) {
        const query = search.toLowerCase();
        const products = (order.items || [])
          .map((item) => item.productName || item.name || "")
          .join(" ");
        const match =
          (order.orderNumber || "").toLowerCase().includes(query) ||
          (order.name || "").toLowerCase().includes(query) ||
          (order.phone || "").toLowerCase().includes(query) ||
          products.toLowerCase().includes(query);
        if (!match) return false;
      }

      const created = new Date(order.createdAt);
      if (fromDate && created < new Date(fromDate)) return false;
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (created > to) return false;
      }

      return true;
    });
  }, [orders, activeTab, search, fromDate, toDate, getString]);

  const orderCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      pickup: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const orderStatus = getString(order.status).toLowerCase();
      if (counts[orderStatus] !== undefined) counts[orderStatus] += 1;
    });

    return counts;
  }, [orders, getString]);

  const getOrderCountByStatus = (statusKey) => orderCounts[statusKey] || 0;

  const getTodaysOrdersCount = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return orders.filter(
      (order) => new Date(order.createdAt).toLocaleDateString() === today
    ).length;
  }, [orders]);

  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    setCurrentPage,
  } = usePagination(filteredOrders, 15);

  const toggleSelectAll = useCallback(
    (event) => {
      setSelectedOrders(
        event.target.checked ? paginatedData.map((order) => order.orderId) : []
      );
    },
    [paginatedData]
  );

  const toggleSelectOne = useCallback((orderId) => {
    setSelectedOrders((previous) =>
      previous.includes(orderId)
        ? previous.filter((id) => id !== orderId)
        : [...previous, orderId]
    );
  }, []);

  const selectedOrderData = useMemo(() => {
    return filteredOrders.filter((order) => selectedOrders.includes(order.orderId));
  }, [filteredOrders, selectedOrders]);

  const exportSelectedCsv = () => {
    if (!selectedOrders.length) {
      toast.error("No orders selected.");
      return;
    }

    const selectedData = selectedOrderData.map((order) => ({
      OrderNumber: order.orderNumber,
      CustomerName: order.name,
      CustomerPhone: order.phone,
      ProductDetails: (order.items || [])
        .map((item) => `${item.productName || item.name || "Product"} (${item.quantity || 1})`)
        .join(", "),
      ShippingCharge: order.shippingCharge,
      TotalAmount: order.grandTotal,
      PaymentMethod: order.paymentMethod,
      PaymentStatus: getString(order.paymentStatus),
      OrderStatus: getString(order.status),
      DatePlaced: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
    }));

    const exported = downloadCsv("selected-orders.csv", selectedData);
    if (!exported) toast.error("No selected orders available to export.");
  };

  const exportFilteredCsv = () => {
    const exported = downloadCsv(
      "filtered-orders.csv",
      filteredOrders.map((order) => ({
        OrderNumber: order.orderNumber || order.orderId || "",
        CustomerName: order.name || "",
        CustomerPhone: order.phone || "",
        Address: order.address || "",
        Products: (order.items || [])
          .map((item) => `${item.productName || item.name || "Product"} (${item.quantity || 1})`)
          .join(" | "),
        ShippingCharge: order.shippingCharge ?? "",
        TotalAmount: order.grandTotal ?? "",
        PaymentMethod: order.paymentMethod || "",
        PaymentStatus: getString(order.paymentStatus),
        OrderStatus: getString(order.status),
        DatePlaced: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "",
      }))
    );

    if (!exported) toast.error("No filtered orders available to export.");
  };

  const handleBulkAction = async (nextStatus) => {
    if (!selectedOrders.length) {
      toast.error("No orders selected.");
      return;
    }

    await Promise.all(
      selectedOrders.map((orderId) => handleStatusUpdate(orderId, nextStatus))
    );
    toast.success(`Order status changed to ${nextStatus}`);
    setSelectedOrders([]);
    setCurrentPage(1);
  };

  const handleDelete = useCallback(
    async (orderId) => {
      const confirmed = await confirmPopup({
        title: "Delete this order?",
        text: "This order will be removed from your dashboard.",
        confirmButtonText: "Delete Order",
      });

      if (!confirmed) return;

      await handleDeleteOrder(orderId);
      toast.success("Order deleted successfully");
    },
    [handleDeleteOrder]
  );

  const filteredTotal = useMemo(
    () =>
      filteredOrders.reduce(
        (sum, order) => sum + Number(order.grandTotal || 0),
        0
      ),
    [filteredOrders]
  );

  const contextValue = {
    orders,
    filteredOrders,
    getOrderCountByStatus,
    getTodaysOrdersCount,
    getPendingOrdersCount: () => orderCounts.pending,
    getProcessingOrdersCount: () => orderCounts.processing,
    getCompletedOrdersCount: () => orderCounts.completed,
    getCanceledOrdersCount: () => orderCounts.cancelled,
    handleStatusUpdate,
    handleDeleteOrder,
    selectedOrders,
    setSelectedOrders,
  };

  const statusTone = (value) => {
    const normalized = getString(value).toLowerCase();
    return {
      pending: "bg-amber-50 text-amber-700 ring-amber-200",
      processing: "bg-blue-50 text-blue-700 ring-blue-200",
      pickup: "bg-violet-50 text-violet-700 ring-violet-200",
      completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
    }[normalized] || "bg-slate-50 text-slate-700 ring-slate-200";
  };

  const syncHorizontalScroll = useCallback((source) => {
    if (syncingScrollRef.current) return;

    const sourceNode = source === "table" ? tableScrollRef.current : stickyScrollRef.current;
    const targetNode = source === "table" ? stickyScrollRef.current : tableScrollRef.current;
    if (!sourceNode || !targetNode) return;

    syncingScrollRef.current = true;
    targetNode.scrollLeft = sourceNode.scrollLeft;
    requestAnimationFrame(() => {
      syncingScrollRef.current = false;
    });
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto w-full max-w-7xl space-y-4 md:space-y-5">
        <section className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Orders workspace
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Placed Orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
                Manage invoices, status updates, exports, and customer orders from one focused table.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px] lg:gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Filtered</p>
                <p className="mt-1 text-xl font-black text-slate-950">{filteredOrders.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Selected</p>
                <p className="mt-1 text-xl font-black text-slate-950">{selectedOrders.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Today</p>
                <p className="mt-1 text-xl font-black text-slate-950">{getTodaysOrdersCount}</p>
              </div>
              <div className="rounded-2xl bg-[var(--theme-muted-bg)] p-3 text-[var(--theme-primary)]">
                <p className="text-[11px] font-black uppercase">Revenue</p>
                <p className="mt-1 break-words text-base font-black sm:text-lg">
                  BDT {filteredTotal.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition ${
                      active
                        ? "bg-[var(--theme-primary)] text-white shadow-[0_12px_28px_rgba(34,197,94,0.22)]"
                        : "bg-slate-50 text-slate-600 hover:bg-[var(--theme-muted-bg)] hover:text-[var(--theme-primary)]"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.display}
                    <span className={active ? "text-white/80" : "text-slate-400"}>
                      {getOrderCountByStatus(tab.label)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_150px_150px] xl:w-auto">
              <label className="relative block sm:col-span-2 lg:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  placeholder="Search order, customer, phone..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <input
                type="date"
                aria-label="From Date"
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
              />
              <input
                type="date"
                aria-label="To Date"
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
            <select
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-muted-bg)] lg:w-52"
              defaultValue=""
              onChange={(event) => event.target.value && handleBulkAction(event.target.value)}
            >
              <option value="" disabled>
                Bulk status action
              </option>
              {bulkStatuses.map((nextStatus) => (
                <option key={nextStatus} value={nextStatus}>
                  {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:flex sm:flex-wrap">
              {paginatedData.length === 1 && (
                <PDFDownloadLink
                  document={<InvoiceDocument order={paginatedData[0]} />}
                  fileName={`invoice_${paginatedData[0].orderNumber}.pdf`}
                >
                  {({ loading }) => (
                    <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 text-xs font-black text-white transition hover:bg-emerald-700 sm:w-auto">
                      <FileText size={15} />
                      {loading ? "Generating..." : "Download Single PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
              )}

              {selectedOrders.length > 0 && (
                <PDFDownloadLink
                  document={<InvoiceDocument orders={selectedOrderData} />}
                  fileName="merged_invoices.pdf"
                >
                  {({ loading }) => (
                    <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 text-xs font-black text-white transition hover:bg-blue-700 sm:w-auto">
                      <Printer size={15} />
                      {loading ? "Generating..." : "Print Selected"}
                    </button>
                  )}
                </PDFDownloadLink>
              )}

              {selectedOrders.length > 0 && (
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 text-xs font-black text-white transition hover:bg-slate-800 sm:w-auto"
                  onClick={exportSelectedCsv}
                >
                  <Download size={15} />
                  Download CSV
                </button>
              )}

              <button
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-3 text-xs font-black text-white transition hover:opacity-90 sm:w-auto"
                onClick={exportFilteredCsv}
              >
                <Download size={15} />
                Export Filtered CSV
              </button>

              {selectedOrders.length === 0 && paginatedData.length !== 1 && (
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 text-xs font-black text-slate-600 transition hover:bg-slate-200 sm:w-auto"
                  onClick={() => toast.error("Select orders or a single order first.")}
                >
                  <Printer size={15} />
                  Print
                </button>
              )}
            </div>
          </div>
        </section>

        <OrdersContext.Provider value={contextValue}>
          <section className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
            <div className="grid gap-3 p-3 md:hidden">
              {paginatedData.length ? (
                paginatedData.map((order) => (
                  <article key={order.orderId} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm border-slate-300"
                          checked={selectedOrders.includes(order.orderId)}
                          onChange={() => toggleSelectOne(order.orderId)}
                        />
                        Select
                      </label>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${statusTone(order.status)}`}>
                        {getString(order.status)}
                      </span>
                    </div>
                    <Link
                      to={`/dashboard/view-order/${order.orderId}`}
                      className="mt-3 block break-words text-sm font-black text-[var(--theme-primary)]"
                    >
                      {order.orderNumber || order.orderId}
                    </Link>
                    <div className="mt-3 grid gap-2 text-xs font-semibold text-slate-600">
                      <p><span className="font-black text-slate-950">Customer:</span> {order.name || "N/A"}</p>
                      <p><span className="font-black text-slate-950">Phone:</span> {order.phone || "No phone"}</p>
                      <p><span className="font-black text-slate-950">Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</p>
                      <p><span className="font-black text-slate-950">Total:</span> BDT {Number(order.grandTotal || 0).toLocaleString("en-US")}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700"
                        onClick={() => navigate(`/dashboard/view-order/${order.orderId}`)}
                        aria-label="View order"
                      >
                        <Eye size={16} />
                      </button>
                      <PDFDownloadLink
                        document={<InvoiceDocument order={order} />}
                        fileName={`invoice_${order.orderNumber}.pdf`}
                      >
                        {() => (
                          <button
                            type="button"
                            className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-blue-50 text-blue-700"
                            aria-label="Download invoice"
                          >
                            <Printer size={16} />
                          </button>
                        )}
                      </PDFDownloadLink>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700"
                        onClick={() => handleDelete(order.orderId)}
                        aria-label="Delete order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <ClipboardList className="mx-auto text-slate-400" size={30} />
                  <p className="mt-3 font-black text-slate-700">No {activeTab} orders found.</p>
                </div>
              )}
            </div>
            <div
              ref={tableScrollRef}
              onScroll={() => syncHorizontalScroll("table")}
              className="dashboard-visible-scrollbar hidden overflow-x-auto md:block"
            >
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="w-12 px-4 py-4">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm border-slate-300"
                        onChange={toggleSelectAll}
                        checked={
                          paginatedData.length > 0 &&
                          selectedOrders.length === paginatedData.length
                        }
                      />
                    </th>
                    <th className="px-4 py-4">Order</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Shipping</th>
                    <th className="px-4 py-4">Total</th>
                    <th className="px-4 py-4">Payment</th>
                    <th className="px-4 py-4">Pay Status</th>
                    <th className="px-4 py-4">Order Status</th>
                    <th className="px-4 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.length ? (
                    paginatedData.map((order) => (
                      <tr key={order.orderId} className="transition hover:bg-slate-50/80">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm border-slate-300"
                            checked={selectedOrders.includes(order.orderId)}
                            onChange={() => toggleSelectOne(order.orderId)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            to={`/dashboard/view-order/${order.orderId}`}
                            className="font-black text-[var(--theme-primary)] hover:underline"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-black text-slate-900">{order.name}</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-500">
                            {order.phone || "No phone"}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-600">
                          BDT {Number(order.shippingCharge || 0).toLocaleString("en-US")}
                        </td>
                        <td className="px-4 py-4 font-black text-slate-950">
                          BDT {Number(order.grandTotal || 0).toLocaleString("en-US")}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                            <Wallet size={13} />
                            {order.paymentMethod || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusTone(order.paymentStatus)}`}>
                            {getString(order.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusTone(order.status)}`}>
                            {getString(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <PDFDownloadLink
                              document={<InvoiceDocument order={order} />}
                              fileName={`invoice_${order.orderNumber}.pdf`}
                            >
                              {({ loading }) => (
                                <button
                                  type="button"
                                  title={loading ? "Generating invoice" : "Download invoice"}
                                  className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                                >
                                  <Printer size={16} />
                                </button>
                              )}
                            </PDFDownloadLink>
                            <button
                              type="button"
                              title="View order"
                              className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                              onClick={() => navigate(`/dashboard/view-order/${order.orderId}`)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              title="Delete order"
                              className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                              onClick={() => handleDelete(order.orderId)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center">
                        <div className="mx-auto max-w-sm rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8">
                          <ClipboardList className="mx-auto text-slate-400" size={32} />
                          <p className="mt-3 font-black text-slate-700">
                            No {activeTab} orders found.
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Try changing status, date, or search filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="sticky bottom-0 z-20 hidden border-t border-slate-100 bg-white/95 px-3 py-2 backdrop-blur md:block">
              <div
                ref={stickyScrollRef}
                onScroll={() => syncHorizontalScroll("sticky")}
                className="dashboard-visible-scrollbar overflow-x-auto"
                aria-label="Scroll orders table horizontally"
              >
                <div className="h-1 w-[980px]" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row">
              <p className="text-xs font-bold text-slate-500">
                Showing {paginatedData.length} of {filteredOrders.length} filtered orders
              </p>
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-9 items-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>
                <span className="text-sm font-black text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="inline-flex h-9 items-center gap-1 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </OrdersContext.Provider>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HandleOrders;
