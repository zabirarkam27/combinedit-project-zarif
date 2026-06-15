import { Link } from "react-router-dom";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  LayoutTemplate,
  Megaphone,
  PackagePlus,
  Settings,
  ShoppingCart,
  Store,
  UserRoundCog,
} from "lucide-react";
import { useOrdersContext } from "../../context/OrdersContext";
import { getProducts } from "../../services/products";
import Stats from "./Stats";

const quickActions = [
  {
    to: "/dashboard/handle-orders",
    title: "Manage Orders",
    description: "Review, update, print, and export orders.",
    icon: ShoppingCart,
  },
  {
    to: "/dashboard/edit-your-products/all",
    title: "Product Catalog",
    description: "Edit product stock, pricing, images, and variants.",
    icon: Boxes,
  },
  {
    to: "/dashboard/edit-your-products/add",
    title: "Add Product",
    description: "Create a new catalog item quickly.",
    icon: PackagePlus,
  },
  {
    to: "/dashboard/create-landing",
    title: "Landing Pages",
    description: "Build product-focused campaign pages.",
    icon: LayoutTemplate,
  },
  {
    to: "/dashboard/marketing-tools",
    title: "Marketing Tools",
    description: "Configure analytics and promotion tools.",
    icon: Megaphone,
  },
  {
    to: "/dashboard/edit-your-profile",
    title: "Business Profile",
    description: "Update brand, contact, social, and theme details.",
    icon: UserRoundCog,
  },
];

const QuickActionCard = memo(({ to, title, description, icon: Icon }) => (
  <Link
    to={to}
    className="group rounded-2xl border border-white/70 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] sm:rounded-3xl sm:p-4"
  >
    <div className="flex items-start gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)] transition group-hover:bg-[var(--theme-primary)] group-hover:text-white">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  </Link>
));

QuickActionCard.displayName = "QuickActionCard";

const getStatus = (order) =>
  String(order?.status?.status || order?.status || "").toLowerCase();

const uniqueCount = (items, key) =>
  new Set(items.map((item) => item?.[key]).filter(Boolean)).size;

const MiniTile = memo(
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
    className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] focus:ring-offset-2"
    aria-label={`Open ${title1} ${title2}`}
  >
    <div className="relative h-32 w-full overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-2xl xs:h-36 sm:h-44">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      />
      <div
        className="wave-clip absolute inset-0 w-full"
        style={{
          background: `linear-gradient(to bottom, ${gradientFromB}, ${gradientToB})`,
        }}
      />
      <div className="relative z-10 p-4 text-white sm:p-6">
        <p className="text-sm font-semibold">{title1}</p>
        <p className="text-sm font-semibold">{title2}</p>
        <h2 className="mt-2 break-words text-2xl font-bold sm:text-3xl">{count}</h2>
      </div>
    </div>
  </Link>
  )
);

MiniTile.displayName = "MiniTile";

const DashboardLayout = () => {
  const { orders = [] } = useOrdersContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (alive) setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load dashboard tile products:", error);
        if (alive) setProducts([]);
      }
    };

    fetchProducts();
    return () => {
      alive = false;
    };
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const dashboardTiles = useMemo(() => {
    const todayKey = new Date().toDateString();
    const statusCount = (status) =>
      orders.filter((order) => getStatus(order) === status).length;
    const customerCount = new Set(
      orders
        .map((order) => order?.phone || order?.email || order?.name)
        .filter(Boolean)
    ).size;

    return [
      {
        title1: "Total",
        title2: "Orders",
        count: orders.length,
        to: "/dashboard/all-orders",
        gradientFrom: "#5346ba",
        gradientTo: "#755bb4",
        gradientFromB: "#7a6ccb",
        gradientToB: "#997fc6",
      },
      {
        title1: "Today's",
        title2: "Orders",
        count: orders.filter((order) => {
          const date = order.createdAt ? new Date(order.createdAt) : null;
          return date && !Number.isNaN(date.getTime()) && date.toDateString() === todayKey;
        }).length,
        to: "/dashboard/all-orders",
        gradientFrom: "#9f5800",
        gradientTo: "#9f5800",
        gradientFromB: "#b47b36",
        gradientToB: "#cb944c",
      },
      {
        title1: "Orders",
        title2: "Pending",
        count: statusCount("pending"),
        to: "/dashboard/pending-orders",
        gradientFrom: "#3e2857",
        gradientTo: "#684267",
        gradientFromB: "#685779",
        gradientToB: "#8a6e87",
      },
      {
        title1: "Orders",
        title2: "Processing",
        count: statusCount("processing"),
        to: "/dashboard/processing-orders",
        gradientFrom: "#6792d6",
        gradientTo: "#54ade7",
        gradientFromB: "#82ade4",
        gradientToB: "#6ccff6",
      },
      {
        title1: "Orders",
        title2: "Completed",
        count: statusCount("completed"),
        to: "/dashboard/completed-orders",
        gradientFrom: "#58a834",
        gradientTo: "#94d456",
        gradientFromB: "#80c15f",
        gradientToB: "#b8e57f",
      },
      {
        title1: "Orders",
        title2: "Canceled",
        count: statusCount("cancelled"),
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
  }, [orders, products]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg">
      <div className="mx-auto w-full max-w-7xl space-y-4 px-3 pb-24 sm:space-y-6 md:px-4 md:pb-10">
        <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.09)] sm:rounded-[32px]">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-7">
            <div className="min-w-0 max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black text-[var(--theme-primary)]">
                <Store size={14} />
                {today}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Dashboard overview
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500 md:text-base">
                Track sales, order health, customer demand, and catalog gaps from one polished workspace.
              </p>
            </div>
            <Link
              to="/dashboard/settings"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] sm:w-fit"
            >
              <Settings size={17} />
              Settings
            </Link>
          </div>
        </section>

        <Stats />

        <section className="rounded-3xl border border-white/70 bg-white/60 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4 md:p-5">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
              Quick tiles
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Snapshot links
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
            {dashboardTiles.map((tile) => (
              <MiniTile key={`${tile.title1}-${tile.title2}`} {...tile} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/60 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-4 md:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
                Operations
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Quick actions
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
