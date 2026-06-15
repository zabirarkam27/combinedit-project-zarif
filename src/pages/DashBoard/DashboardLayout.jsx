import { Link } from "react-router-dom";
import { memo, useEffect, useMemo, useState } from "react";
import {
  AlertOctagon,
  BadgeCheck,
  Building2,
  Boxes,
  CalendarDays,
  ClipboardList,
  LayoutTemplate,
  Megaphone,
  PackagePlus,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Timer,
  UserRoundCog,
  Users,
  XCircle,
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
    className="group rounded-3xl border border-white/70 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
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

const MiniTile = memo(({ to, title, value, icon: Icon, tone }) => (
  <Link
    to={to}
    className="group rounded-2xl border border-white/70 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
    aria-label={`Open ${title}`}
  >
    <div className="flex items-center justify-between gap-3">
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${tone}`}>
        <Icon size={18} />
      </span>
      <span className="text-right text-2xl font-black text-slate-950">
        {value}
      </span>
    </div>
    <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">
      {title}
    </p>
  </Link>
));

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
        title: "Total Orders",
        value: orders.length,
        to: "/dashboard/all-orders",
        icon: ClipboardList,
        tone: "bg-indigo-50 text-indigo-700",
      },
      {
        title: "Today's Orders",
        value: orders.filter((order) => {
          const date = order.createdAt ? new Date(order.createdAt) : null;
          return date && !Number.isNaN(date.getTime()) && date.toDateString() === todayKey;
        }).length,
        to: "/dashboard/all-orders",
        icon: CalendarDays,
        tone: "bg-amber-50 text-amber-700",
      },
      {
        title: "Pending",
        value: statusCount("pending"),
        to: "/dashboard/pending-orders",
        icon: Timer,
        tone: "bg-yellow-50 text-yellow-700",
      },
      {
        title: "Processing",
        value: statusCount("processing"),
        to: "/dashboard/processing-orders",
        icon: ShoppingCart,
        tone: "bg-blue-50 text-blue-700",
      },
      {
        title: "Completed",
        value: statusCount("completed"),
        to: "/dashboard/completed-orders",
        icon: BadgeCheck,
        tone: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "Canceled",
        value: statusCount("cancelled"),
        to: "/dashboard/canceled-orders",
        icon: XCircle,
        tone: "bg-red-50 text-red-700",
      },
      {
        title: "Products",
        value: products.length,
        to: "/dashboard/edit-your-products/all",
        icon: Boxes,
        tone: "bg-violet-50 text-violet-700",
      },
      {
        title: "Categories",
        value: uniqueCount(products, "category"),
        to: "/dashboard/edit-your-products/all?view=categories",
        icon: Tags,
        tone: "bg-cyan-50 text-cyan-700",
      },
      {
        title: "Brands",
        value: uniqueCount(products, "brand"),
        to: "/dashboard/edit-your-products/all?view=brands",
        icon: Building2,
        tone: "bg-fuchsia-50 text-fuchsia-700",
      },
      {
        title: "Customers",
        value: customerCount,
        to: "/dashboard/all-orders",
        icon: Users,
        tone: "bg-teal-50 text-teal-700",
      },
      {
        title: "Out of Stock",
        value: products.filter((product) => !product?.inStock).length,
        to: "/dashboard/edit-your-products/all?stock=out",
        icon: AlertOctagon,
        tone: "bg-rose-50 text-rose-700",
      },
      {
        title: "Landing Pages",
        value: "Open",
        to: "/dashboard/existing-pages",
        icon: LayoutTemplate,
        tone: "bg-orange-50 text-orange-700",
      },
    ];
  }, [orders, products]);

  return (
    <div className="min-h-screen w-full theme-dashboard-bg">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-2 pb-10 md:px-4">
        <section className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
          <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-7">
            <div className="max-w-2xl">
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
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
            >
              <Settings size={17} />
              Settings
            </Link>
          </div>
        </section>

        <Stats />

        <section className="rounded-[32px] border border-white/70 bg-white/60 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-5">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--theme-primary)]">
              Quick tiles
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Snapshot links
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {dashboardTiles.map((tile) => (
              <MiniTile key={tile.title} {...tile} />
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/60 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] md:p-5">
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

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
