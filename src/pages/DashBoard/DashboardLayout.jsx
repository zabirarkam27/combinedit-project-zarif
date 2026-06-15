import { Link } from "react-router-dom";
import { memo } from "react";
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

const DashboardLayout = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

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
