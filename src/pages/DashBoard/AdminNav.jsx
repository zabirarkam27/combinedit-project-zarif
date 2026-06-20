import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ExternalLink, Menu, Settings, UserRoundCog, X } from "lucide-react";

const NotificationDropdown = lazy(() => import("./NotificationDropdown"));

const AdminNav = () => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!profileMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="navbar sticky top-0 z-[60] min-h-16 shrink-0 border-b border-white/15 px-3 shadow-[0_16px_45px_rgba(15,23,42,0.16)] theme-gradient theme-gradient-hover md:px-8">
      <div className="flex-1">
        <div className="flex items-center gap-3 sm:gap-5">
          <label
            htmlFor="dashboard-drawer"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-2xl bg-white/12 text-white ring-1 ring-white/20 transition hover:bg-white/20 lg:hidden"
            aria-label="Open dashboard menu"
          >
            <Menu size={22} />
          </label>

          <Link
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20 transition hover:bg-white/20"
            to="/dashboard"
            aria-label="Back to dashboard"
          >
            <img src="/nav-icon/logo.png" alt="Company Logo" className="h-8 w-8 object-contain" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-3 py-2 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            View Site
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Suspense fallback={<div className="h-10 w-10 rounded-2xl bg-white/15" />}>
          <NotificationDropdown />
        </Suspense>

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            aria-label="Open admin menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <img alt="Admin Avatar" src="/nav-icon/admin.png" className="h-8 w-8 object-contain" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-12 z-[90] mt-3 w-64 overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
              <div className="flex items-center justify-between bg-[var(--theme-muted-bg)] px-4 py-3">
                <div>
                  <p className="text-sm font-black text-slate-950">Admin Menu</p>
                  <p className="text-xs font-semibold text-slate-500">Manage profile and settings</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-500 transition hover:text-slate-950"
                  aria-label="Close admin menu"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-2">
                <Link
                  to="/dashboard/edit-your-profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black text-slate-700 transition hover:bg-[var(--theme-muted-bg)] hover:text-[var(--theme-primary)]"
                >
                  <UserRoundCog size={18} />
                  Edit Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black text-slate-700 transition hover:bg-[var(--theme-muted-bg)] hover:text-[var(--theme-primary)]"
                >
                  <Settings size={18} />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-3 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNav;

