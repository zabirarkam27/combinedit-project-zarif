import { Link } from "react-router-dom";
import { memo, useMemo } from "react";
import { useOrdersContext } from "../../context/OrdersContext";
import DashItems from "./DashItems";
import Stats from "./Stats";

// QuickActionCard Component
const QuickActionCard = memo(
  ({ to, imgSrc, title, bgClass, gradientClass }) => (
    <Link
      to={to}
      className={`group block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ${bgClass} shadow-lg w-full`}
    >
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-48 object-contain p-3 transform transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className={`text-center text-white font-semibold px-4 py-3 rounded-b-xl ${gradientClass} bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right`}
      >
        {title}
      </div>
    </Link>
  )
);

const DashboardLayout = () => {
  const {
    getOrderCountByStatus,
    getTodaysOrdersCount,
    getPendingOrdersCount,
    getProcessingOrdersCount,
    getCompletedOrdersCount,
    getCanceledOrdersCount,
  } = useOrdersContext();

  // Memoized actions for rendering quick cards
  const quickActions = useMemo(
    () => [
      {
        to: "/dashboard/handle-orders",
        imgSrc: "/icons/16.png",
        title: "Handle Orders",
        bgClass: "bg-[#cdc3ff]",
        gradientClass:
          "bg-gradient-to-r from-[#7154ff] via-[#9172ff] to-[#7154ff]",
      },
      {
        to: "/dashboard/edit-your-products",
        imgSrc: "/icons/36.png",
        title: "Edit Your Products",
        bgClass: "bg-[#00555a]",
        gradientClass:
          "bg-gradient-to-r from-[#00555a] via-[#007272] to-[#00555a]",
      },
      {
        to: "/dashboard/edit-your-profile",
        imgSrc: "/icons/4.png",
        title: "Edit Your Profile",
        bgClass: "bg-[#b5e4e0]",
        gradientClass:
          "bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e]",
      },
    ],
    []
  );

  return (
    <div className="relative bg-[#ebf0f0] min-h-screen flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-black my-10">
        Admin Wallet
      </h1>

      <div className="px-6 mb-6 w-full">
        <Stats />
        <DashItems
          getOrderCountByStatus={getOrderCountByStatus}
          getTodaysOrdersCount={getTodaysOrdersCount}
          getPendingOrdersCount={getPendingOrdersCount}
          getProcessingOrdersCount={getProcessingOrdersCount}
          getCompletedOrdersCount={getCompletedOrdersCount}
          getCanceledOrdersCount={getCanceledOrdersCount}
        />
      </div>

      {/* Quick action cards */}
      <div className="flex flex-col md:flex-row w-full gap-6 justify-center px-6 mb-10">
        {quickActions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
