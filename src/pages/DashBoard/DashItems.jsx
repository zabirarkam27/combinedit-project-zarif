import { Link } from "react-router-dom";
import { memo, useMemo } from "react";

// Reusable StatCard component
const StatCard = memo(
  ({
    to,
    title1,
    title2,
    count,
    gradientFrom,
    gradientTo,
    gradientFromB,
    gradientToB,
  }) => (
    <Link to={to || "#"} className="tab-link">
      <div className="relative rounded-xl overflow-hidden w-full h-50 shadow-lg hover:shadow-2xl hover:scale-105 hover:cursor-pointer transition-transform duration-200 ease-in-out">
        {/* Horizontal gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          }}
        ></div>
        {/* Vertical gradient */}
        <div
          className="absolute inset-0 wave-clip w-full"
          style={{
            background: `linear-gradient(to bottom, ${gradientFromB}, ${gradientToB})`,
          }}
        ></div>
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">{title1}</p>
          <p className="text-sm">{title2}</p>
          <h2 className="text-3xl font-bold">{count}</h2>
        </div>
      </div>
    </Link>
  )
);

const DashItems = ({
  getOrderCountByStatus,
  getTodaysOrdersCount,
  getPendingOrdersCount,
  getProcessingOrdersCount,
  getCompletedOrdersCount,
  getCanceledOrdersCount,
}) => {
  // Memoize all counts
  const statsData = useMemo(() => {
    const safeGetCount = (fn, fallback = 0) => {
      try {
        return typeof fn === "function" ? fn() : fallback;
      } catch (error) {
        console.error("Error fetching count:", error);
        return fallback;
      }
    };

    return [
      {
        title1: "Total",
        title2: "Orders",
        count: safeGetCount(() => getOrderCountByStatus("all")),
        to: "/dashboard/all-orders",
        gradientFrom: "#5346ba",
        gradientTo: "#755bb4",
        gradientFromB: "#7a6ccb",
        gradientToB: "#997fc6",
      },
      {
        title1: "Today's",
        title2: "Orders",
        count: safeGetCount(getTodaysOrdersCount),
        to: "/dashboard/all-orders",
        gradientFrom: "#9f5800",
        gradientTo: "#9f5800",
        gradientFromB: "#b47b36",
        gradientToB: "#cb944c",
      },
      {
        title1: "Orders",
        title2: "Pending",
        count: safeGetCount(getPendingOrdersCount),
        to: "/dashboard/pending-orders",
        gradientFrom: "#3e2857",
        gradientTo: "#684267",
        gradientFromB: "#685779",
        gradientToB: "#8a6e87",
      },
      {
        title1: "Orders",
        title2: "Processing",
        count: safeGetCount(getProcessingOrdersCount),
        to: "/dashboard/processing-orders",
        gradientFrom: "#6792d6",
        gradientTo: "#54ade7",
        gradientFromB: "#82ade4",
        gradientToB: "#6ccff6",
      },
      {
        title1: "Orders",
        title2: "Completed",
        count: safeGetCount(getCompletedOrdersCount),
        to: "/dashboard/completed-orders",
        gradientFrom: "#58a834",
        gradientTo: "#94d456",
        gradientFromB: "#80c15f",
        gradientToB: "#b8e57f",
      },
      {
        title1: "Orders",
        title2: "Canceled",
        count: safeGetCount(getCanceledOrdersCount),
        to: "/dashboard/canceled-orders",
        gradientFrom: "#733a86",
        gradientTo: "#a6326c",
        gradientFromB: "#96609d",
        gradientToB: "#d45580",
      },
      {
        title1: "Total",
        title2: "Products",
        count: 11,
        gradientFrom: "#526293",
        gradientTo: "#5c4d8b",
        gradientFromB: "#7581ab",
        gradientToB: "#816a9f",
      },
      {
        title1: "Total",
        title2: "Categories",
        count: 11,
        gradientFrom: "#02a9af",
        gradientTo: "#00c4ae",
        gradientFromB: "#30c1bd",
        gradientToB: "#32d6bd",
      },
      {
        title1: "Total",
        title2: "Bands",
        count: 11,
        gradientFrom: "#df635f",
        gradientTo: "#f7a17f",
        gradientFromB: "#e88c85",
        gradientToB: "#fcc39f",
      },
      {
        title1: "Total",
        title2: "Customers",
        count: 11,
        gradientFrom: "#e06b66",
        gradientTo: "#f8b28e",
        gradientFromB: "#ea9d96",
        gradientToB: "#fdd3b0",
      },
      {
        title1: "Total",
        title2: "Out of Stock Products",
        count: 11,
        gradientFrom: "#ef4062",
        gradientTo: "#f78271",
        gradientFromB: "#f67285",
        gradientToB: "#fdc093",
      },
      // ✅ Missing card from your original code restored
      {
        title1: "Total",
        title2: "Categories",
        count: 11,
        gradientFrom: "#d6ae7b",
        gradientTo: "#e3c295",
        gradientFromB: "#e2c195",
        gradientToB: "#edd6b5",
      },
    ];
  }, [
    getOrderCountByStatus,
    getTodaysOrdersCount,
    getPendingOrdersCount,
    getProcessingOrdersCount,
    getCompletedOrdersCount,
    getCanceledOrdersCount,
  ]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default memo(DashItems);
