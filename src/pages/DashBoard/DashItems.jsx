import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../services/products";

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
    <Link
      to={to}
      className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-secondary)]"
      aria-label={`Open ${title1} ${title2}`}
    >
      <div className="relative h-50 w-full overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-2xl">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          }}
        />
        <div
          className="absolute inset-0 wave-clip w-full"
          style={{
            background: `linear-gradient(to bottom, ${gradientFromB}, ${gradientToB})`,
          }}
        />
        <div className="relative z-10 p-6 text-white">
          <p className="text-sm">{title1}</p>
          <p className="text-sm">{title2}</p>
          <h2 className="text-3xl font-bold">{count}</h2>
        </div>
      </div>
    </Link>
  )
);

const uniqueCount = (items, key) =>
  new Set(items.map((item) => item?.[key]).filter(Boolean)).size;

const DashItems = ({
  getOrderCountByStatus,
  getTodaysOrdersCount,
  getPendingOrdersCount,
  getProcessingOrdersCount,
  getCompletedOrdersCount,
  getCanceledOrdersCount,
  orders = [],
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        if (isMounted) setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching dashboard products:", error);
        if (isMounted) setProducts([]);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const statsData = useMemo(() => {
    const safeGetCount = (fn, fallback = 0) => {
      try {
        return typeof fn === "function" ? fn() : fallback;
      } catch (error) {
        console.error("Error fetching count:", error);
        return fallback;
      }
    };

    const customerCount = new Set(
      orders
        .map((order) => order?.phone || order?.email || order?.name)
        .filter(Boolean)
    ).size;

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
        count: products.length,
        to: "/dashboard/edit-your-products/all",
        gradientFrom: "#526293",
        gradientTo: "#5c4d8b",
        gradientFromB: "#7581ab",
        gradientToB: "#816a9f",
      },
      {
        title1: "Total",
        title2: "Categories",
        count: uniqueCount(products, "category"),
        to: "/dashboard/edit-your-products/all?view=categories",
        gradientFrom: "#02a9af",
        gradientTo: "#00c4ae",
        gradientFromB: "#30c1bd",
        gradientToB: "#32d6bd",
      },
      {
        title1: "Total",
        title2: "Brands",
        count: uniqueCount(products, "brand"),
        to: "/dashboard/edit-your-products/all?view=brands",
        gradientFrom: "#df635f",
        gradientTo: "#f7a17f",
        gradientFromB: "#e88c85",
        gradientToB: "#fcc39f",
      },
      {
        title1: "Total",
        title2: "Customers",
        count: customerCount,
        to: "/dashboard/all-orders",
        gradientFrom: "#e06b66",
        gradientTo: "#f8b28e",
        gradientFromB: "#ea9d96",
        gradientToB: "#fdd3b0",
      },
      {
        title1: "Out of Stock",
        title2: "Products",
        count: products.filter((product) => !product?.inStock).length,
        to: "/dashboard/edit-your-products/all?stock=out",
        gradientFrom: "#ef4062",
        gradientTo: "#f78271",
        gradientFromB: "#f67285",
        gradientToB: "#fdc093",
      },
      {
        title1: "Landing",
        title2: "Pages",
        count: "Open",
        to: "/dashboard/existing-pages",
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
    orders,
    products,
  ]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {statsData.map((stat) => (
        <StatCard key={`${stat.title1}-${stat.title2}`} {...stat} />
      ))}
    </div>
  );
};

export default memo(DashItems);
