import { useState, useEffect, useMemo } from "react";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import api from "../../api";
import FancyBarChart from "./FancyBarChart";
import FancyCityBarChart from "./FancyCityBarChart";
import FancyPieChart from "./FancyPieChart";

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

const Stats = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders once + polling every 30s
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Memoized calculation of stats
  const stats = useMemo(() => {
    const totalSales = orders.reduce((acc, o) => acc + o.grandTotal, 0);

    const activeOrders = orders.filter(
      (o) => o.status !== "completed" && o.status !== "cancelled"
    );
    const completedOrders = orders.filter((o) => o.status === "completed");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");

    // Monthly data
    const monthlySales = new Array(12).fill(0);
    const monthlyActive = new Array(12).fill(0);
    const monthlyCompleted = new Array(12).fill(0);
    const monthlyCancelled = new Array(12).fill(0);

    orders.forEach((o) => {
      const monthIndex = new Date(o.createdAt).getMonth();
      monthlySales[monthIndex] += o.grandTotal;

      if (o.status === "completed")
        monthlyCompleted[monthIndex] += o.grandTotal;
      else if (o.status === "cancelled")
        monthlyCancelled[monthIndex] += o.grandTotal;
      else monthlyActive[monthIndex] += o.grandTotal;
    });

    const currentMonth = new Date().getMonth();
    const calculatePercentage = (thisMonth, lastMonth) =>
      lastMonth === 0
        ? thisMonth > 0
          ? 100
          : 0
        : ((thisMonth - lastMonth) / lastMonth) * 100;

    return {
      totalSales,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      monthlySales,
      monthlyActive,
      monthlyCompleted,
      monthlyCancelled,
      percentChange: calculatePercentage(
        monthlySales[currentMonth],
        currentMonth > 0 ? monthlySales[currentMonth - 1] : 0
      ),
      activePercent: calculatePercentage(
        monthlyActive[currentMonth],
        currentMonth > 0 ? monthlyActive[currentMonth - 1] : 0
      ),
      completedPercent: calculatePercentage(
        monthlyCompleted[currentMonth],
        currentMonth > 0 ? monthlyCompleted[currentMonth - 1] : 0
      ),
      cancelledPercent: calculatePercentage(
        monthlyCancelled[currentMonth],
        currentMonth > 0 ? monthlyCancelled[currentMonth - 1] : 0
      ),
      activeAmount: monthlyActive[currentMonth],
      completedAmount: monthlyCompleted[currentMonth],
      cancelledAmount: monthlyCancelled[currentMonth],
    };
  }, [orders]);

  const renderChange = (percent, isCancelled = false) => (
    <div className="flex flex-col mt-3 items-start gap-1">
      {percent > 0 ? (
        <div className="flex items-center gap-1">
          {isCancelled ? (
            <BsFillArrowDownCircleFill className="text-red-500" />
          ) : (
            <BsFillArrowUpCircleFill className="text-green-500" />
          )}
          <span
            className={`${
              isCancelled ? "text-red-600" : "text-green-600"
            } font-medium`}
          >
            +{Math.abs(percent).toFixed(2)}%
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {isCancelled ? (
            <BsFillArrowUpCircleFill className="text-green-500" />
          ) : (
            <BsFillArrowDownCircleFill className="text-red-500" />
          )}
          <span
            className={`${
              isCancelled ? "text-green-600" : "text-red-600"
            } font-medium`}
          >
            -{Math.abs(percent).toFixed(2)}%
          </span>
        </div>
      )}
      <h3 className="text-xs text-gray-500">from last month</h3>
    </div>
  );

  return (
    <div>
      <div className="stats-container rounded-lg grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Sales Chart */}
        <div className="order-chart bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xs">Monthly Sales</h2>
          <p className="font-bold text-xl">৳ {stats.totalSales}</p>
          <FancyBarChart labels={months} values={stats.monthlySales} />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Total Sales</h2>
            <p className="text-xl font-bold">৳ {stats.totalSales}</p>
            {renderChange(stats.percentChange)}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Active Orders</h2>
            <p className="text-xl font-bold">
              {stats.activeOrders}{" "}
              <span className="text-sm font-thin text-gray-500">
                (৳ {stats.activeAmount})
              </span>
            </p>
            {renderChange(stats.activePercent)}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Completed Orders</h2>
            <p className="text-xl font-bold">
              {stats.completedOrders}{" "}
              <span className="text-sm font-thin text-gray-500">
                (৳ {stats.completedAmount})
              </span>
            </p>
            {renderChange(stats.completedPercent)}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Cancelled Orders</h2>
            <p className="text-xl font-bold">
              {stats.cancelledOrders}{" "}
              <span className="text-sm font-thin text-gray-500">
                (৳ {stats.cancelledAmount})
              </span>
            </p>
            {renderChange(stats.cancelledPercent, true)}
          </div>
        </div>
      </div>

      {/* Pie Chart and City Chart */}
      <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <FancyPieChart orders={orders} />
        <FancyCityBarChart orders={orders} />
      </div>
    </div>
  );
};

export default Stats;
