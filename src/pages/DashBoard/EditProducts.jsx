import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Layers3,
  PackagePlus,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";

const productActions = [
  {
    title: "Add New Product",
    description: "Create a product with images, pricing, colors, variants, and stock rules.",
    image: "/icons/14.png",
    to: "/dashboard/edit-your-products/add",
    icon: PackagePlus,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "View All Products",
    description: "Search, edit, export, or delete products from the live catalog.",
    image: "/icons/23.png",
    to: "/dashboard/edit-your-products/all",
    icon: Boxes,
    tone: "bg-blue-50 text-blue-700",
  },
];

const quickLinks = [
  {
    label: "Categories",
    to: "/dashboard/edit-your-products/all?view=categories",
    icon: Layers3,
  },
  {
    label: "Brands",
    to: "/dashboard/edit-your-products/all?view=brands",
    icon: Sparkles,
  },
  {
    label: "Out of Stock",
    to: "/dashboard/edit-your-products/all?stock=out",
    icon: Search,
  },
];

const EditProducts = () => {
  return (
    <div className="min-h-screen w-full theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black text-[var(--theme-primary)]">
                <Settings2 size={14} />
                Catalog workspace
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Edit Products
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500 md:text-base">
                Keep product images, pricing, inventory, variants, and catalog visibility organized from one clean dashboard.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[440px]">
              {quickLinks.map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 text-xs font-black text-slate-700 transition hover:bg-[var(--theme-muted-bg)] hover:text-[var(--theme-primary)]"
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {productActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]"
              >
                <div className="relative grid h-52 place-items-center overflow-hidden bg-slate-50 p-6 md:h-64">
                  <span className={`absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl ${action.tone}`}>
                    <Icon size={22} />
                  </span>
                  <img
                    src={action.image}
                    alt=""
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        {action.title}
                      </h2>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        {action.description}
                      </p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)] transition group-hover:bg-[var(--theme-primary)] group-hover:text-white">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default EditProducts;
