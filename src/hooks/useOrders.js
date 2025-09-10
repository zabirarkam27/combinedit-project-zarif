import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { getOrders, updateOrderStatus, deleteOrder } from "../services/orders"; // Correct import
import api from "../api";

const normalizeImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") return [images];
  if (typeof images === "object") return Object.values(images);
  return [];
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const tableRef = useRef();

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      const data = Array.isArray(res.data) ? res.data : [res.data];

      const mappedOrders = data.map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        return {
          orderId: order._id?.toString(),
          orderNumber: order.orderNumber,
          name: order.name,
          phone: order.phone,
          address: order.address,
          note: order.note || "",
          createdAt: order.createdAt,
          grandTotal: order.grandTotal,
          items: items,
          products: items.map((item) => item.productName).join(", "),
          quantities: items.map((item) => item.quantity).join(", "),
          unitPrices: items.map((item) => item.unitPrice).join(", "),
          finalPrices: items.map((item) => item.finalPrice).join(","),
          images: items.flatMap((item) => normalizeImages(item.images)),
          status: order.status || "pending",
          paymentMethod: order.paymentMethod || "Cash on Delivery",
          paymentStatus: order.paymentStatus || "pending",
          shippingCharge: order.shippingCharge || 0,
        };
      });

      setOrders(mappedOrders);
    } catch (err) {
      toast.error("Failed to load orders.");
      console.error(err);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId); // Using the deleteOrder function

      // Update the local state by filtering out the deleted order
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );

      toast.success("✅ Order deleted successfully!");
    } catch (err) {
      toast.error("❌ Failed to delete order.");
      console.error(err);
    }
  };

  // View single order
  const handleViewOrder = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      return res.data; // return fetched order
    } catch (err) {
      toast.error("Failed to fetch order details.");
      console.error(err);
    }
  };

  // Update order status & paymentStatus (single or bulk)
  const handleStatusUpdate = async (orderId, status, paymentStatus) => {
    try {
      // PATCH request to backend
      await api.patch(`/orders/${orderId}`, { status, paymentStatus });

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: status || order.status,
                paymentStatus: paymentStatus || order.paymentStatus,
              }
            : order
        )
      );

      toast.success("✅ Order updated successfully!");
    } catch (err) {
      toast.error("❌ Failed to update order.");
      console.error(err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchTab = activeTab === "all" ? true : order.status === activeTab;
    const query = search.toLowerCase();
    const matchSearch =
      order.name?.toLowerCase().includes(query) ||
      order.phone?.toLowerCase().includes(query) ||
      order.products?.toLowerCase().includes(query);
    return matchTab && matchSearch;
  });

  // Download filtered orders as Excel
  const handleDownload = () => {
    if (!filteredOrders.length) return toast.info("No orders to download.");
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders-${activeTab}.xlsx`);
  };

  // Print filtered orders
  const handlePrint = () => {
    const printContent = tableRef.current?.innerHTML;
    if (!printContent) return toast.info("Nothing to print.");
    const printWindow = window.open("", "", "width=1000,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Orders</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>${
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          } Orders</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return {
    orders,
    filteredOrders,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    tableRef,
    fetchOrders,
    handleViewOrder,
    handleStatusUpdate,
    handleDownload,
    handlePrint,
    handleDeleteOrder,
  };
};
