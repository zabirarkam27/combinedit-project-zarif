import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const statusColors = {
  pending: "#facc15",
  processing: "#3b82f6",
  pickup: "#9333ea",
  completed: "#59a934",
  cancelled: "#dc2626",
  paid: "#f59e0b",
};

const FancyPieChart = ({ orders = [] }) => {
  // Memoized data generation
  const data = useMemo(() => {
    const counts = {
      pending: 0,
      processing: 0,
      pickup: 0,
      completed: 0,
      cancelled: 0,
      paid: 0,
    };

    orders.forEach((o) => {
      if (o.status && counts[o.status] !== undefined) counts[o.status]++;
      if (o.paymentStatus === "completed") counts.paid++;
    });

    return [
      {
        name: "Completed",
        value: counts.completed,
        color: statusColors.completed,
      },
      { name: "Paid", value: counts.paid, color: statusColors.paid },
      { name: "Pickup", value: counts.pickup, color: statusColors.pickup },
      {
        name: "Processing",
        value: counts.processing,
        color: statusColors.processing,
      },
      { name: "Pending", value: counts.pending, color: statusColors.pending },
      {
        name: "Cancelled",
        value: counts.cancelled,
        color: statusColors.cancelled,
      },
    ];
  }, [orders]);

  const totalOrders = useMemo(
    () =>
      data
        .filter((item) => item.name !== "Paid")
        .reduce((acc, item) => acc + item.value, 0),
    [data]
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center relative">
      <h2 className="text-sm font-semibold mb-2">Order Count</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Middle text */}
      <div className="absolute inset-0 -top-3 flex flex-col items-center justify-center pointer-events-none">
        <h3 className="text-xs text-gray-800">Total Orders</h3>
        <p className="text-2xl font-bold">{totalOrders}</p>
      </div>
    </div>
  );
};

export default FancyPieChart;
