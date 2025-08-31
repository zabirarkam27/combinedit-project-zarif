import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { getOrders, updateOrderStatus } from "../../services/orders";

// --- helper to normalize images field ---
const normalizeImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") return [images];
  if (typeof images === "object") return Object.values(images);
  return [];
};

const HandleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const tableRef = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      const data = Array.isArray(res.data) ? res.data : [res.data];

      const mappedOrders = data.map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];

        return {
          orderId: order._id?.toString(),
          name: order.name,
          phone: order.phone,
          address: order.address,
          note: order.note || "",
          createdAt: order.createdAt,
          grandTotal: order.grandTotal,

          // Products details
          products: items.map((item) => item.productName).join(", "),
          quantities: items.map((item) => item.quantity).join(", "),
          unitPrices: items.map((item) => item.unitPrice).join(", "),
          finalPrices: items.map((item) => item.finalPrice).join(", "),

          // ✅ Collect all images from items
          images: items.flatMap((item) => normalizeImages(item.images)),

          // ✅ Use order.status if exists, otherwise fallback
          status: order.status || "pending",
        };
      });

      setOrders(mappedOrders);
    } catch (err) {
      toast.error("Failed to load orders.");
      console.error("Error fetching orders:", err);
    }
  };

  // ✅ Update Status
  const handleStatusUpdate = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "completed");
      toast.success("Order marked as completed");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status.");
      console.error(err);
    }
  };

  // ✅ Search + Filter by Tab
  const filteredOrders = orders.filter(
    (order) =>
      order.status === activeTab &&
      (order.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.phone?.includes(search) ||
        order.products?.toLowerCase().includes(search.toLowerCase()))
  );

  // ✅ Download Excel
  const handleDownload = () => {
    if (!filteredOrders.length) return toast.info("No orders to download.");
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders-${activeTab}.xlsx`);
  };

  // ✅ Print
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
          <h2>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="w-full mx-auto p-1 md:p-4 bg-[#ebf0f0] shadow-md">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-black my-10">
        Placed Orders
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex mr-4">
          <button onClick={handleDownload} className="btn btn-xs btn-ghost mr-2">
            <img src="/download-icon.png" alt="Download icon" />
          </button>
          <button onClick={handlePrint} className="btn btn-xs btn-ghost mr-2">
            <img src="/print-icon.png" alt="Print icon" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name, phone, or product..."
          className="input input-bordered w-full md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto" ref={tableRef}>
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="bg-base-200">
              <th>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Products</th>
              <th>Images</th>
              <th>Quantities</th>
              <th>Unit Prices</th>
              <th>Total Prices</th>
              <th>Status</th>
              {activeTab === "pending" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <input type="checkbox" className="checkbox checkbox-sm" />
                  </td>
                  <td>{order.orderId}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.products}</td>
                  <td>
                    {order.images?.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {order.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`product-${idx}`}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ))}
                      </div>
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{order.quantities}</td>
                  <td>{order.unitPrices}</td>
                  <td>{order.grandTotal}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        order.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-green-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  {activeTab === "pending" && (
                    <td>
                      <button
                        onClick={() => handleStatusUpdate(order.orderId)}
                        className="btn btn-xs btn-success"
                      >
                        <img src="/dot-menu.png" alt="" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={activeTab === "pending" ? 12 : 11}
                  className="text-center"
                >
                  No {activeTab} orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default HandleOrders;
