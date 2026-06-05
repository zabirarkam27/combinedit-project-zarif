import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import { Suspense, lazy } from "react";

// Lazy load notification dropdown
const NotificationDropdown = lazy(() => import("./NotificationDropdown"));

const AdminNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className="navbar sticky top-0 z-[60] min-h-16 shrink-0 px-3 md:px-8 shadow-lg theme-gradient theme-gradient-hover"
    >
      {/* Left section */}
      <div className="flex-1">
        <div className="flex items-center gap-6">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent p-0 lg:hidden"
          >
            <img src="/nav-icon/hamburger.png" alt="Menu" className="w-6" />
          </label>

          <Link
            className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent p-0"
            to="/dashboard"
            aria-label="Back to dashboard"
          >
            <img
              src="/nav-icon/logo.png"
              alt="Company Logo"
              className="w-10 mx-auto"
            />
          </Link>

          <Link
            to="/"
            className="font-bold text-gray-800"
          >
            View Site
          </Link>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Notification dropdown with Suspense */}
        <Suspense
          fallback={<div className="w-6 h-6 bg-gray-300 rounded-full" />}
        >
          <NotificationDropdown />
        </Suspense>

        {/* Admin avatar dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent p-0 avatar"
          >
            <div className="w-10">
              <img alt="Admin Avatar" src="/nav-icon/admin.png" />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#ebf0f0] rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/dashboard/edit-your-profile">Edit Profile</Link>
            </li>
            <li>
              <Link to="/dashboard/settings">Settings</Link>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
