import { useEffect, useMemo, useState } from "react";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";

import api from "../../api";
import { downloadCsv } from "../../utils/csv";
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

const getStatus = (order) =>
  String(order?.status?.status || order?.status || "").toLowerCase();

const Stats = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = window.setInterval(fetchOrders, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const totalSales = orders.reduce(
      (acc, order) => acc + Number(order.grandTotal || 0),
      0
    );

    const activeOrders = orders.filter((order) => {
      const status = getStatus(order);
      return status !== "completed" && status !== "cancelled";
    });
    const completedOrders = orders.filter(
      (order) => getStatus(order) === "completed"
    );
    const cancelledOrders = orders.filter(
      (order) => getStatus(order) === "cancelled"
    );

    const monthlySales = new Array(12).fill(0);
    const monthlyActive = new Array(12).fill(0);
    const monthlyCompleted = new Array(12).fill(0);
    const monthlyCancelled = new Array(12).fill(0);

    orders.forEach((order) => {
      const monthIndex = new Date(order.createdAt).getMonth();
      const total = Number(order.grandTotal || 0);
      const status = getStatus(order);

      if (Number.isNaN(monthIndex)) return;

      monthlySales[monthIndex] += total;
      if (status === "completed") monthlyCompleted[monthIndex] += total;
      else if (status === "cancelled") monthlyCancelled[monthIndex] += total;
      else monthlyActive[monthIndex] += total;
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

  const renderChange = (percent, isCancelled = false) => {
    const positive = percent > 0;
    const Icon = positive ? BsFillArrowUpCircleFill : BsFillArrowDownCircleFill;
    const colorClass = isCancelled
      ? positive
        ? "text-red-600"
        : "text-green-600"
      : positive
        ? "text-green-600"
        : "text-red-600";

    return (
      <div className="mt-3 flex flex-col items-start gap-1">
        <div className="flex items-center gap-1">
          <Icon className={colorClass} />
          <span className={`${colorClass} font-medium`}>
            {positive ? "+" : "-"}
            {Math.abs(percent).toFixed(2)}%
          </span>
        </div>
        <h3 className="text-xs text-gray-500">from last month</h3>
      </div>
    );
  };

  const exportDailySales = () => {
    const dailyTotals = orders.reduce((days, order) => {
      const date = order.createdAt
        ? new Date(order.createdAt).toISOString().slice(0, 10)
        : "Unknown";
      const current = days[date] || { Orders: 0, Sales: 0 };
      current.Orders += 1;
      current.Sales += Number(order.grandTotal || 0);
      days[date] = current;
      return days;
    }, {});

    downloadCsv(
      "daily-sales.csv",
      Object.entries(dailyTotals)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([Date, values]) => ({ Date, ...values }))
    );
  };

  const exportSalesByProduct = () => {
    const productTotals = {};

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.productName || item.name || item.productId || "Unknown";
        const current = productTotals[key] || {
          Product: key,
          Quantity: 0,
          Revenue: 0,
        };
        current.Quantity += Number(item.quantity || 0);
        current.Revenue += Number(item.finalPrice || item.unitPrice || 0);
        productTotals[key] = current;
      });
    });

    downloadCsv("sales-by-product.csv", Object.values(productTotals));
  };

  const SummaryCard = ({ to, title, value, amount, children }) => (
    <Link
      to={to}
      className="block rounded-xl bg-white p-5 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-secondary)]"
    >
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="text-xl font-bold">
        {value}
        {amount !== undefined && (
          <span className="text-sm font-thin text-gray-500">
            {" "}
            (BDT {amount})
          </span>
        )}
      </p>
      {children}
    </Link>
  );

  return (
    <div>
      <div className="stats-container grid grid-cols-1 gap-4 rounded-lg md:grid-cols-2 md:gap-6">
        <div className="order-chart rounded-xl bg-white p-5 shadow-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xs">Monthly Sales</h2>
              <p className="text-xl font-bold">BDT {stats.totalSales}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportDailySales}
                className="btn btn-xs border-0 text-white theme-gradient theme-gradient-hover"
              >
                Daily CSV
              </button>
              <button
                type="button"
                onClick={exportSalesByProduct}
                className="btn btn-xs border-0 text-white theme-gradient theme-gradient-hover"
              >
                Product CSV
              </button>
            </div>
          </div>
          <FancyBarChart labels={months} values={stats.monthlySales} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SummaryCard
            to="/dashboard/all-orders"
            title="Total Sales"
            value={`BDT ${stats.totalSales}`}
          >
            {renderChange(stats.percentChange)}
          </SummaryCard>
          <SummaryCard
            to="/dashboard/processing-orders"
            title="Active Orders"
            value={stats.activeOrders}
            amount={stats.activeAmount}
          >
            {renderChange(stats.activePercent)}
          </SummaryCard>
          <SummaryCard
            to="/dashboard/completed-orders"
            title="Completed Orders"
            value={stats.completedOrders}
            amount={stats.completedAmount}
          >
            {renderChange(stats.completedPercent)}
          </SummaryCard>
          <SummaryCard
            to="/dashboard/canceled-orders"
            title="Cancelled Orders"
            value={stats.cancelledOrders}
            amount={stats.cancelledAmount}
          >
            {renderChange(stats.cancelledPercent, true)}
          </SummaryCard>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
        <FancyPieChart orders={orders} />
        <FancyCityBarChart orders={orders} />
      </div>
    </div>
  );
};

export default Stats;
