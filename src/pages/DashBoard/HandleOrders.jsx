import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { getOrders, updateOrderStatus } from "../../services/orders";

const HandleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const tableRef = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      const data = Array.isArray(res.data) ? res.data : [res.data];

      const groupedOrders = data.map((order) => {
        const items =
          order.items && Array.isArray(order.items)
            ? order.items
            : [
                {
                  productId: order.productId,
                  productName: order.productName,
                  unitPrice: order.unitPrice || order.price,
                  quantity: order.quantity || 1,
                  finalPrice: order.finalPrice || order.price,
                  status: order.status,
                },
              ];

        return {
          orderId: order._id.toString(), // <-- ObjectId কে string এ convert করলেই safe
          name: order.name,
          phone: order.phone,
          address: order.address,
          note: order.note || "",
          products: items.map((item) => item.productName).join(", "),
          quantities: items.map((item) => item.quantity).join(", "),
          unitPrices: items.map((item) => item.unitPrice).join(", "),
          finalPrices: items.map((item) => item.finalPrice).join(", "),
          status: items.every((item) => item.status === "completed")
            ? "completed"
            : "pending",
        };
      });

      setOrders(groupedOrders);
    } catch (err) {
      toast.error("Failed to load orders.");
      console.error("Error fetching orders:", err);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    console.log("Updating order with ID:", orderId); // debug
    if (!orderId) {
      toast.error("Invalid order ID");
      return;
    }

    try {
      await updateOrderStatus(orderId, "completed");
      toast.success("Order marked as completed");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status.");
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.status === activeTab &&
      (order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.products.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDownload = () => {
    if (!filteredOrders.length) return toast.info("No orders to download.");
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders-${activeTab}.xlsx`);
  };

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
    <div className="max-w-6xl mx-auto p-4 mt-8 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4 text-primary">
        Placed Orders
      </h2>

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
            activeTab === "completed" ? "bg-green-600 text-white" : "bg-gray-200"
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
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Note</th>
              <th>Products</th>
              <th>Quantities</th>
              <th>Unit Prices</th>
              <th>Final Prices</th>
              <th>Status</th>
              {activeTab === "pending" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length ? (
              filteredOrders.map((order, index) => (
                <tr key={order.orderId}>
                  <td>{index + 1}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>{order.note}</td>
                  <td>{order.products}</td>
                  <td>{order.quantities}</td>
                  <td>{order.unitPrices}</td>
                  <td>{order.finalPrices}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        order.status === "pending" ? "bg-yellow-500" : "bg-green-600"
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
                        Mark Completed
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === "pending" ? 11 : 10} className="text-center">
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
