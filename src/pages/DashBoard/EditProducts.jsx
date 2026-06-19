import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  Layers3,
  PackageCheck,
  PackagePlus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Warehouse,
} from "lucide-react";

const productActions = [
  {
    title: "Add New Product",
    description: "Create a polished catalog item with images, auto colors, pricing, variants, stock, and visibility rules.",
    to: "/dashboard/edit-your-products/add",
    icon: PackagePlus,
    tone: "from-emerald-500 to-green-700",
    iconTone: "bg-emerald-50 text-emerald-700",
    checklist: ["Media upload", "Variant setup", "Stock controls"],
  },
  {
    title: "View All Products",
    description: "Search, edit, export, filter, or remove live catalog products from a responsive management table.",
    to: "/dashboard/edit-your-products/all",
    icon: Boxes,
    tone: "from-sky-500 to-blue-700",
    iconTone: "bg-blue-50 text-blue-700",
    checklist: ["Advanced search", "CSV export", "Bulk review"],
  },
];

const quickLinks = [
  {
    label: "Categories",
    helper: "Review catalog groups",
    to: "/dashboard/edit-your-products/all?view=categories",
    icon: Layers3,
  },
  {
    label: "Brands",
    helper: "Check brand coverage",
    to: "/dashboard/edit-your-products/all?view=brands",
    icon: Sparkles,
  },
  {
    label: "Out of Stock",
    helper: "Fix inventory gaps",
    to: "/dashboard/edit-your-products/all?stock=out",
    icon: Search,
  },
];

const workflowItems = [
  {
    title: "Create",
    text: "Upload images, set colors, and prepare the product story.",
    icon: PackagePlus,
  },
  {
    title: "Organize",
    text: "Keep categories, brands, prices, and variants clean.",
    icon: Tags,
  },
  {
    title: "Maintain",
    text: "Review stock, visibility, and catalog quality regularly.",
    icon: Warehouse,
  },
];

const EditProducts = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden theme-dashboard-bg px-2 py-4 md:px-4">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--theme-muted-bg)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                <Settings2 size={14} />
                Catalog workspace
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                Edit Products
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500 md:text-base">
                Build, organize, and maintain the full product catalog from one clean dashboard workspace.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {quickLinks.map(({ label, helper, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-[var(--theme-primary)] hover:bg-[var(--theme-muted-bg)]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[var(--theme-primary)] shadow-sm">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-slate-900">
                      {label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">
                      {helper}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className="ml-auto text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[var(--theme-primary)]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {productActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]"
              >
                <div className={`relative min-h-52 overflow-hidden bg-gradient-to-br ${action.tone} p-5 text-white`}>
                  <div className="relative flex h-full min-h-44 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-16 w-16 place-items-center rounded-[24px] bg-white/95 text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                        <Icon size={30} />
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wide backdrop-blur">
                        <SlidersHorizontal size={14} />
                        Manage
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                        {action.title}
                      </h2>
                      <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/80">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {action.checklist.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600"
                      >
                        <PackageCheck size={13} className="text-[var(--theme-primary)]" />
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className={`grid h-11 w-11 place-items-center rounded-2xl ${action.iconTone}`}>
                      <Icon size={19} />
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-black text-[var(--theme-primary)]">
                      Open workspace
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
              <ClipboardList size={20} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[var(--theme-primary)]">
                Workflow
              </p>
              <h2 className="text-xl font-black text-slate-950">Catalog operating flow</h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {workflowItems.map(({ title, text, icon: Icon }, index) => (
              <div
                key={title}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[var(--theme-primary)] shadow-sm">
                    <Icon size={19} />
                  </span>
                  <span className="text-xs font-black text-slate-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProducts;
