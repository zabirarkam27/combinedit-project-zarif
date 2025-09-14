import { useState, useEffect } from "react";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import api from "../../api";
import FancyBarChart from "./FancyBarChart";
import FancyCityBarChart from "./FancyCityBarChart";
import FancyPieChart from "./FancyPieChart";

const Stats = () => {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  const [percentChange, setPercentChange] = useState(0);
  const [activePercent, setActivePercent] = useState(0);
  const [completedPercent, setCompletedPercent] = useState(0);
  const [cancelledPercent, setCancelledPercent] = useState(0);

  const [activeAmount, setActiveAmount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [cancelledAmount, setCancelledAmount] = useState(0);

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

  const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0) {
      return thisMonth > 0 ? 100 : 0;
    }
    return ((thisMonth - lastMonth) / lastMonth) * 100;
  };

  const calculateStats = (orders) => {
    const total = orders.reduce((acc, order) => acc + order.grandTotal, 0);
    setTotalSales(total);

    const completed = orders.filter((o) => o.status === "completed").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const active = orders.filter(
      (o) => o.status !== "completed" && o.status !== "cancelled"
    ).length;

    setCompletedOrders(completed);
    setCancelledOrders(cancelled);
    setActiveOrders(active);

    const monthlySales = new Array(12).fill(0);
    const monthlyActive = new Array(12).fill(0);
    const monthlyCompleted = new Array(12).fill(0);
    const monthlyCancelled = new Array(12).fill(0);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthIndex = date.getMonth();

      monthlySales[monthIndex] += order.grandTotal;

      if (order.status === "completed") {
        monthlyCompleted[monthIndex] += order.grandTotal;
      } else if (order.status === "cancelled") {
        monthlyCancelled[monthIndex] += order.grandTotal;
      } else {
        monthlyActive[monthIndex] += order.grandTotal;
      }
    });

    setChartValues(monthlySales);

    const currentMonthIndex = new Date().getMonth();

    const thisMonth = monthlySales[currentMonthIndex];
    const lastMonth =
      currentMonthIndex > 0 ? monthlySales[currentMonthIndex - 1] : 0;
    setPercentChange(calculatePercentage(thisMonth, lastMonth));

    // Active %
    const thisActive = monthlyActive[currentMonthIndex];
    const lastActive =
      currentMonthIndex > 0 ? monthlyActive[currentMonthIndex - 1] : 0;
    setActiveAmount(thisActive);
    setActivePercent(calculatePercentage(thisActive, lastActive));

    // Completed %
    const thisCompleted = monthlyCompleted[currentMonthIndex];
    const lastCompleted =
      currentMonthIndex > 0 ? monthlyCompleted[currentMonthIndex - 1] : 0;
    setCompletedAmount(thisCompleted);
    setCompletedPercent(calculatePercentage(thisCompleted, lastCompleted));

    // Cancelled %
    const thisCancelled = monthlyCancelled[currentMonthIndex];
    const lastCancelled =
      currentMonthIndex > 0 ? monthlyCancelled[currentMonthIndex - 1] : 0;
    setCancelledAmount(thisCancelled);
    setCancelledPercent(calculatePercentage(thisCancelled, lastCancelled));
  };

  const renderCancelledChange = (percent) => (
    <div className="flex flex-col mt-3 items-start gap-1">
      {percent > 0 ? (
        <div className="flex items-center gap-1">
          <BsFillArrowDownCircleFill className="text-red-500" />
          <span className="text-red-600 font-medium">
            +{Math.abs(percent).toFixed(2)}%
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <BsFillArrowUpCircleFill className="text-green-500" />
          <span className="text-green-600 font-medium">
            -{Math.abs(percent).toFixed(2)}%
          </span>
        </div>
      )}
      <h3 className="text-xs text-gray-500">from last month</h3>
    </div>
  );

  const renderChange = (percent) => (
    <div className="flex flex-col mt-3 items-start gap-1">
      {percent > 0 ? (
        <div className="flex items-center gap-1">
          <BsFillArrowUpCircleFill className="text-green-500" />
          <span className="text-green-600 font-medium">
            +{Math.abs(percent).toFixed(2)}%
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <BsFillArrowDownCircleFill className="text-red-500" />
          <span className="text-red-600 font-medium">
            -{Math.abs(percent).toFixed(2)}%
          </span>
        </div>
      )}
      <h3 className="text-xs text-gray-500">from last month</h3>
    </div>
  );

  return (
    <div>
      <div className="stats-container p-5 bg-gray-50 rounded-lg shadow-lg grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Sales Chart */}
        <div className="order-chart bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xs">Monthly Sales</h2>
          <p className="font-bold text-xl">৳ {totalSales}</p>
          <FancyBarChart labels={months} values={chartValues} />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total sales */}
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Total Sales</h2>
            <p className="text-xl font-bold">৳ {totalSales}</p>
            {renderChange(percentChange)}
          </div>

          {/* Active Orders */}
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Active Orders</h2>
            <p className="text-xl font-bold">
              {activeOrders}{" "}
              <span className="text-sm font-thin text-gray-500">
                (৳ {activeAmount})
              </span>
            </p>
            {renderChange(activePercent)}
          </div>

          {/* Completed Orders */}
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Completed Orders</h2>
            <p className="text-xl font-bold">
              {completedOrders}{" "}
              <span className="text-sm font-thin text-gray-500">
                (৳ {completedAmount})
              </span>
            </p>
            {renderChange(completedPercent)}
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white p-5 rounded-xl shadow-lg">
            <h2 className="text-sm font-semibold">Cancelled Orders</h2>
            <p className="text-xl font-bold">
              {cancelledOrders}{" "}
              <span className="text-sm font-thin text-gray-500">
                (৳ {cancelledAmount})
              </span>
            </p>
            {renderCancelledChange(cancelledPercent)}
          </div>
        </div>
        {/* Pie Chart */}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <FancyPieChart orders={orders} />
        </div>
        <FancyCityBarChart orders={orders} />
      </div>
    </div>
  );
};

export default Stats;
