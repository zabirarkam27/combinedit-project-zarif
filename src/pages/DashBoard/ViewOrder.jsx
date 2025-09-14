import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useOrders } from "../../hooks/useOrders";
import "react-toastify/dist/ReactToastify.css";

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleStatusUpdate, handleViewOrder } = useOrders();

  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  // Helper function to safely get string
  const getString = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) {
      return value.status || value.paymentStatus || "Unknown";
    }
    return "Unknown";
  };

  // Fetch order by ID
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await handleViewOrder(id);
        if (!data) return;

        setOrder(data);
        setPaymentStatus(getString(data.paymentStatus) || "pending");
        setOrderStatus(getString(data.status) || "pending");
      } catch (err) {
        toast.error("❌ Failed to load order details");
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className="text-center mt-10">Loading...</p>;

  // Update order status & paymentStatus
  const handleUpdate = async () => {
    try {
      await handleStatusUpdate(id, orderStatus, paymentStatus);
      setOrder((prev) => ({
        ...prev,
        status: orderStatus,
        paymentStatus,
      }));
      toast.success("✅ Order updated successfully!");

      navigate("/dashboard/handle-orders");
    } catch (err) {
      toast.error("❌ Failed to update order");
      console.error(err);
    }
  };

  // Copy customer details
  const handleCopy = () => {
    const customerDetails = `Customer Details: \nName: ${
      order.name || "N/A"
    }\nPhone: ${order.phone || "N/A"}\nAddress: ${order.address || "N/A"}`;
    navigator.clipboard
      .writeText(customerDetails)
      .then(() => {
        toast.success("Customer details copied to clipboard!");
      })
      .catch((err) => {
        toast.error("❌ Failed to copy!");
        console.error("Copy failed", err);
      });
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Order Header */}
      <div className="md:col-span-3 bg-gray-50 shadow-lg rounded-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="p-2 bg-[#e1fafa] rounded">
            <strong>Order#:</strong> {order.orderNumber}
          </div>
          <div className="p-2 bg-[#e1fafa] not-visited:rounded">
            <strong>Order Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="p-2 bg-[#e1fafa] rounded">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </div>
          <div className="p-2 bg-yellow-200 rounded">
            <strong>Payment Status:</strong> {getString(paymentStatus)}
          </div>
          <div className="p-2 bg-blue-200 rounded">
            <strong>Order Status:</strong> {getString(orderStatus)}
          </div>
        </div>
      </div>

      {/* Left Side - Order Details */}
      <div className="md:col-span-2 bg-gray-50 shadow-lg rounded-lg p-6">
        {/* Product Table */}
        <table className="table w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
                <td>{item.finalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right mb-6">
          <p>
            <strong>Shipping:</strong> {order.shippingCharge || 0}
          </p>
          <p>
            <strong>Tax:</strong> {order.tax || 0}
          </p>
          <p>
            <strong>Grand Total:</strong> {order.grandTotal}
          </p>
        </div>

        {/* Status Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold">Payment Status*</label>
            <select
              className="select select-bordered w-full"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Order Status*</label>
            <select
              className="select select-bordered w-full"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="pickup">Pickup</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={handleUpdate} className="btn btn-success">
            Update
          </button>
          <button
            onClick={() => navigate(`/dashboard/invoice/${order._id}`)}
            className="btn btn-info"
          >
            Invoice
          </button>
          <button
            onClick={() => navigate("/dashboard/handle-orders")}
            className="btn btn-warning"
          >
            Back To List
          </button>
        </div>
      </div>

      {/* Right Side - Customer Details */}
      <div className="bg-gray-50 shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold mb-4">Customer Details</h2>
          <button onClick={handleCopy} className="ml-2">
            <img
              src="https://img.icons8.com/?size=100&id=37930&format=png&color=000000"
              alt="copy-icon"
              className="w-5 h-5 cursor-pointer"
            />
          </button>
        </div>
        <p>
          <strong>Name:</strong> {order.name || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {order.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {order.address || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ViewOrder;
