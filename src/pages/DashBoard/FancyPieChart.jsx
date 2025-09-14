import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const statusColors = {
  pending: "#facc15",
  processing: "#3b82f6",
  pickup: "#9333ea",
  completed: "#59a934",
  cancelled: "#dc2626",
  paid: "#f59e0b",
};

// Pie Chart Component
const FancyPieChart = ({ orders }) => {
  // Order count by status
  const data = [
    {
      name: "Completed",
      value: orders.filter((o) => o.status === "completed").length,
      color: statusColors.completed,
    },
    {
      name: "Paid",
      value: orders.filter((o) => o.paymentStatus === "completed").length,
      color: statusColors.paid,
    },
    {
      name: "Pickup",
      value: orders.filter((o) => o.status === "pickup").length,
      color: statusColors.pickup,
    },
    {
      name: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
      color: statusColors.processing,
    },
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      color: statusColors.pending,
    },
    {
      name: "Cancelled",
      value: orders.filter((o) => o.status === "cancelled").length,
      color: statusColors.cancelled,
    },
  ];

  const totalOrders = data
    .filter((item) => item.name !== "Paid")
    .reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-sm font-semibold">Order Count</h2>
      <ResponsiveContainer width="100%" height={350}>
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
          <Legend verticalAlign="middle" align="right" layout="vertical" />
        </PieChart>
      </ResponsiveContainer>

      {/* Middle text */}
      <div className="absolute inset-0 -left-26 top-6 flex flex-col items-center justify-center">
        <h3 className="text-xs text-gray-800">Total Order</h3>
        <p className="text-2xl font-bold">{totalOrders}</p>
      </div>
    </div>
  );
};

export default FancyPieChart;
