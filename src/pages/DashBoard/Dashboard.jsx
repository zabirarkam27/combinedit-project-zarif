import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import {
  Boxes,
  ChevronDown,
  Home,
  LayoutTemplate,
  LogOut,
  Megaphone,
  PackagePlus,
  Settings,
  ShoppingCart,
  UserRoundCog,
} from "lucide-react";
import AdminNav from "./AdminNav";

const primaryLinks = [
  { to: "/dashboard", label: "Dashboard Home", icon: Home, end: true },
  { to: "/dashboard/handle-orders", label: "Handle Orders", icon: ShoppingCart },
  { to: "/dashboard/edit-your-products", label: "Edit Products", icon: Boxes },
  { to: "/dashboard/edit-your-profile", label: "Edit Profile", icon: UserRoundCog },
  { to: "/dashboard/marketing-tools", label: "Marketing Tools", icon: Megaphone },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const landingLinks = [
  { to: "/dashboard/create-landing", label: "Create New", icon: PackagePlus },
  { to: "/dashboard/existing-pages", label: "Existing Pages", icon: LayoutTemplate },
];

const closeDashboardDrawer = () => {
  if (typeof window === "undefined") return;
  const drawer = document.getElementById("dashboard-drawer");
  if (drawer && window.matchMedia("(max-width: 1023px)").matches) {
    drawer.checked = false;
  }
};

const sidebarLinkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
    isActive
      ? "bg-white text-[var(--theme-primary)] shadow-[0_14px_30px_rgba(15,23,42,0.12)] ring-1 ring-white/70"
      : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
  }`;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const landingOpen = location.pathname.includes("landing") || location.pathname.includes("existing-pages");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeDashboardDrawer();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="drawer lg:drawer-open lg:h-screen lg:overflow-hidden">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
        <AdminNav />
        <main className="min-h-screen w-full overflow-x-hidden px-0 py-0 md:px-3 md:py-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <aside className="drawer-side z-[80] lg:sticky lg:top-0 lg:z-40 lg:h-screen lg:overflow-y-auto">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" aria-label="Close dashboard menu" />
        <div className="h-full min-h-full w-[284px] overflow-y-auto border-r border-white/70 bg-[var(--theme-dashboard-bg)] p-4 pt-20 shadow-[18px_0_55px_rgba(15,23,42,0.12)] lg:min-h-screen lg:pt-4 lg:shadow-none">
          <div className="mb-5 overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--theme-muted-bg)] text-[var(--theme-primary)]">
                <Home size={22} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">Admin Console</p>
                <p className="truncate text-xs font-semibold text-slate-500">Combined IT dashboard</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2" aria-label="Dashboard navigation">
            {primaryLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={closeDashboardDrawer} className={sidebarLinkClass}>
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                        isActive
                          ? "bg-[var(--theme-primary)] text-white"
                          : "bg-white/70 text-[var(--theme-primary)] group-hover:bg-[var(--theme-muted-bg)]"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}

            <details open={landingOpen} className="group rounded-2xl bg-white/45 p-1">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black text-slate-700 transition hover:bg-white/70 hover:text-slate-950">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/80 text-[var(--theme-primary)]">
                  <LayoutTemplate size={18} />
                </span>
                <span className="min-w-0 flex-1 truncate">Landing Page</span>
                <ChevronDown className="transition group-open:rotate-180" size={16} />
              </summary>
              <div className="mt-1 space-y-1 pl-3">
                {landingLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={closeDashboardDrawer} className={sidebarLinkClass}>
                    {({ isActive }) => (
                      <>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition ${
                            isActive ? "bg-[var(--theme-primary)] text-white" : "bg-white/70 text-[var(--theme-primary)]"
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </details>
          </nav>

          <button
            onClick={handleLogout}
            className="theme-gradient theme-gradient-hover mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(11,125,35,0.22)] transition active:scale-[0.99]"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;
