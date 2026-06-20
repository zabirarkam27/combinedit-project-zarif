import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCopy,
  FileText,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";

import { useOrders } from "../../hooks/useOrders";
import "react-toastify/dist/ReactToastify.css";

const paymentStatuses = ["pending", "completed", "cancelled"];
const orderStatuses = ["pending", "processing", "pickup", "completed", "cancelled"];

const getString = (value, fallback = "pending") => {
  if (typeof value === "string") return value || fallback;
  if (value && typeof value === "object") {
    return value.status || value.paymentStatus || fallback;
  }
  return fallback;
};

const formatCurrency = (value) =>
  `BDT ${Number(value || 0).toLocaleString("en-US")}`;

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
};

const statusTone = (value) => {
  const status = getString(value).toLowerCase();
  return {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    processing: "bg-blue-50 text-blue-700 ring-blue-200",
    pickup: "bg-violet-50 text-violet-700 ring-violet-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  }[status] || "bg-slate-50 text-slate-700 ring-slate-200";
};

const getItemImage = (item) => {
  const images = [
    item?.selectedImage,
    item?.selectedOptions?.image,
    ...(Array.isArray(item?.images) ? item.images : [item?.images]),
  ].filter(Boolean);
  return images[0] || "";
};

const selectedBadges = (item) => {
  const options = item?.selectedOptions || {};
  return [
    item?.variation || options.size ? `Size: ${item?.variation || options.size}` : "",
    item?.color || options.color ? `Color: ${item?.color || options.color}` : "",
  ].filter(Boolean);
};

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleStatusUpdate, handleViewOrder } = useOrders({ autoFetch: false });

  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await handleViewOrder(id);
        if (!data) throw new Error("Order not found");
        if (!alive) return;

        setOrder(data);
        setPaymentStatus(getString(data.paymentStatus));
        setOrderStatus(getString(data.status));
      } catch (error) {
        toast.error("Failed to load order details");
        console.error(error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      alive = false;
    };
  }, [id, handleViewOrder]);

  const totals = useMemo(() => {
    const itemsTotal = (order?.items || []).reduce(
      (sum, item) => {
        const lineTotal =
          item.finalPrice ??
          Number(item.unitPrice || 0) * Number(item.quantity || 1);
        return sum + Number(lineTotal || 0);
      },
      0
    );
    return {
      itemsTotal,
      shipping: Number(order?.shippingCharge || 0),
      tax: Number(order?.tax || 0),
      grand: Number(order?.grandTotal ?? itemsTotal),
    };
  }, [order]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await handleStatusUpdate(id, orderStatus, paymentStatus);
      setOrder((previous) => ({
        ...previous,
        status: orderStatus,
        paymentStatus,
      }));
      toast.success("Order updated successfully");
      navigate("/dashboard/handle-orders");
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!order) return;
    const customerDetails = `Customer Details:\nName: ${order.name || "N/A"}\nPhone: ${
      order.phone || "N/A"
    }\nAddress: ${order.address || "N/A"}`;

    navigator.clipboard
      .writeText(customerDetails)
      .then(() => toast.success("Customer details copied"))
      .catch(() => toast.error("Failed to copy customer details"));
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <RefreshCw className="mx-auto animate-spin text-[var(--theme-primary)]" size={30} />
          <p className="mt-4 font-black text-slate-800">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <Package className="mx-auto text-slate-400" size={34} />
          <h1 className="mt-4 text-xl font-black text-slate-950">Order not found</h1>
          <button
            onClick={() => navigate("/dashboard/handle-orders")}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white"
          >
            <ArrowLeft size={16} />
            Back to orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                onClick={() => navigate("/dashboard/handle-orders")}
                className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-200"
              >
                <ArrowLeft size={15} />
                Back to orders
              </button>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Order details
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                {order.orderNumber || "Order"}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
                <CalendarDays size={16} />
                {formatDate(order.createdAt)}
                <span className="text-slate-300">/</span>
                {order.items?.length || 0} item{(order.items?.length || 0) === 1 ? "" : "s"}
              </p>
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4 xl:min-w-[560px]">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Payment</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusTone(paymentStatus)}`}>
                  {paymentStatus}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Order</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusTone(orderStatus)}`}>
                  {orderStatus}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] font-black uppercase text-slate-500">Shipping</p>
                <p className="mt-1 text-lg font-black text-slate-950">{formatCurrency(totals.shipping)}</p>
              </div>
              <div className="rounded-2xl bg-[var(--theme-muted-bg)] p-3 text-[var(--theme-primary)]">
                <p className="text-[11px] font-black uppercase">Grand Total</p>
                <p className="mt-1 text-lg font-black">{formatCurrency(totals.grand)}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
          <div className="min-w-0 space-y-5">
            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <div className="border-b border-slate-100 p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                  Products
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Order items</h2>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {(order.items || []).map((item, index) => {
                  const image = getItemImage(item);
                  const badges = selectedBadges(item);
                  const itemTotal =
                    item.finalPrice || Number(item.unitPrice || 0) * Number(item.quantity || 1);

                  return (
                    <article
                      key={`${item.productName || "item"}-mobile-${index}`}
                      className="rounded-3xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex min-w-0 gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt={item.productName || "Product"}
                            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-slate-100"
                          />
                        ) : (
                          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-slate-400">
                            <Package size={20} />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-black leading-snug text-slate-950">
                            {item.productName || item.name || "Product"}
                          </p>
                          {badges.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {badges.map((badge) => (
                                <span
                                  key={badge}
                                  className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 text-center text-xs font-bold text-slate-500">
                        <div>
                          <p className="uppercase">Qty</p>
                          <p className="mt-1 text-sm font-black text-slate-950">{Number(item.quantity || 1)}</p>
                        </div>
                        <div>
                          <p className="uppercase">Price</p>
                          <p className="mt-1 text-sm font-black text-slate-950">{formatCurrency(item.unitPrice)}</p>
                        </div>
                        <div>
                          <p className="uppercase">Total</p>
                          <p className="mt-1 text-sm font-black text-slate-950">{formatCurrency(itemTotal)}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Product</th>
                      <th className="px-5 py-4">Qty</th>
                      <th className="px-5 py-4">Unit Price</th>
                      <th className="px-5 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(order.items || []).map((item, index) => {
                      const image = getItemImage(item);
                      const badges = selectedBadges(item);
                      return (
                        <tr key={`${item.productName || "item"}-${index}`}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {image ? (
                                <img
                                  src={image}
                                  alt={item.productName || "Product"}
                                  className="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-100"
                                />
                              ) : (
                                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                                  <Package size={20} />
                                </span>
                              )}
                              <div>
                                <p className="font-black text-slate-950">
                                  {item.productName || item.name || "Product"}
                                </p>
                                {badges.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {badges.map((badge) => (
                                      <span
                                        key={badge}
                                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600"
                                      >
                                        {badge}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-black text-slate-700">
                            {Number(item.quantity || 1)}
                          </td>
                          <td className="px-5 py-4 font-bold text-slate-600">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-5 py-4 text-right font-black text-slate-950">
                            {formatCurrency(
                              item.finalPrice ||
                                Number(item.unitPrice || 0) * Number(item.quantity || 1)
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Update
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Status controls</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Payment Status
                  </span>
                  <select
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                    value={paymentStatus}
                    onChange={(event) => setPaymentStatus(event.target.value)}
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-black uppercase text-slate-500">
                    Order Status
                  </span>
                  <select
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 outline-none transition focus:border-[var(--theme-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--theme-muted-bg)]"
                    value={orderStatus}
                    onChange={(event) => setOrderStatus(event.target.value)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[var(--theme-primary)] px-4 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShieldCheck size={17} />
                  {saving ? "Updating..." : "Update order"}
                </button>
                <button
                  onClick={() => navigate(`/dashboard/invoice/${order._id || order.orderId}`)}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <FileText size={17} />
                  Invoice
                </button>
                <button
                  onClick={() => navigate("/dashboard/handle-orders")}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                >
                  <ArrowLeft size={17} />
                  Back to list
                </button>
              </div>
            </section>
          </div>

          <aside className="min-w-0 space-y-5">
            <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                    Customer
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">Details</h2>
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy customer details"
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                >
                  <ClipboardCopy size={17} />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <User className="mt-0.5 text-[var(--theme-primary)]" size={18} />
                  <div>
                    <p className="text-xs font-black uppercase text-slate-500">Name</p>
                    <p className="font-bold text-slate-900">{order.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <Phone className="mt-0.5 text-[var(--theme-primary)]" size={18} />
                  <div>
                    <p className="text-xs font-black uppercase text-slate-500">Phone</p>
                    <p className="font-bold text-slate-900">{order.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <MapPin className="mt-0.5 shrink-0 text-[var(--theme-primary)]" size={18} />
                  <div>
                    <p className="text-xs font-black uppercase text-slate-500">Address</p>
                    <p className="font-bold leading-6 text-slate-900">{order.address || "N/A"}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Payment summary
              </p>
              <div className="mt-4 space-y-3 text-sm font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>Items total</span>
                  <span>{formatCurrency(totals.itemsTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(totals.shipping)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between text-lg font-black text-slate-950">
                    <span>Grand total</span>
                    <span>{formatCurrency(totals.grand)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Method
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                  <Wallet size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">Payment method</p>
                  <p className="font-black text-slate-950">{order.paymentMethod || "N/A"}</p>
                </div>
              </div>
              {order.note && (
                <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">
                  {order.note}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewOrder;
