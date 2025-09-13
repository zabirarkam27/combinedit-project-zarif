import { useState, useEffect } from "react";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import api from "../../api";
import FancyBarChart from "./FancyBarChart";

const Stats = () => {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const [chartValues, setChartValues] = useState([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
        calculateStats(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const calculateStats = (orders) => {
    const total = orders.reduce((acc, order) => acc + order.grandTotal, 0);
    const completed = orders.filter((o) => o.status === "completed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const active = orders.filter(
      (o) => o.status !== "completed" && o.status !== "cancelled"
    ).length;

    // মাসভিত্তিক সেল অ্যারে বানানো
    const monthlySales = new Array(12).fill(0);
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthIndex = date.getMonth(); // 0-11
      monthlySales[monthIndex] += order.grandTotal;
    });

    setTotalSales(total);
    setCompletedOrders(completed);
    setCancelledOrders(cancelled);
    setActiveOrders(active);
    setChartValues(monthlySales);

    // Percentage change হিসাব (শেষ 2 মাস ধরে)
    const thisMonth = monthlySales[new Date().getMonth()];
    const lastMonth =
      new Date().getMonth() > 0 ? monthlySales[new Date().getMonth() - 1] : 0;

    if (lastMonth > 0) {
      const percentage = ((thisMonth - lastMonth) / lastMonth) * 100;
      setPercentChange(percentage);
    }
  };

  return (
    <div className="stats-container p-5 bg-gray-50 rounded-lg shadow-lg grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Sales Chart */}
      <div className="order-chart bg-white p-5 rounded-xl shadow-lg">
        <h2 className="text-xs">Monthly Sales</h2>
        <p className="font-bold text-xl">৳ {totalSales}</p>
        <FancyBarChart labels={months} values={chartValues} />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-sm font-semibold">Total Sales</h2>
          <p className="text-xl font-bold">৳ {totalSales}</p>
          <div>
            {percentChange > 0 ? (
              <BsFillArrowUpCircleFill className="text-green-500" />
            ) : (
              <BsFillArrowDownCircleFill className="text-red-500" />
            )}
            {Math.abs(percentChange).toFixed(2)}%{" "}
            <h3 className="text-xs">from last month</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-sm font-semibold">Active Orders</h2>
          <p className="text-xl">{activeOrders} orders</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-sm font-semibold">Completed Orders</h2>
          <p className="text-xl">{completedOrders} orders</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-sm font-semibold">Cancelled Orders</h2>
          <p className="text-xl">{cancelledOrders} orders</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
