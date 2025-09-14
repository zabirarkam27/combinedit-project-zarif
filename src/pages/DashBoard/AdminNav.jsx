import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import NotificationDropdown from "./NotificationDropdown"; // ইমপোর্ট করো

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
    <div className="navbar sticky top-0 z-50 px-3 md:px-8 bg-gray-500 shadow-sm">
      {/* Left section */}
      <div className="flex-1">
        <div className="flex items-center gap-6">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent p-0 lg:hidden"
          >
            <img src="/nav-icon/hamburger.png" alt="" className="w-6" />
          </label>

          <a
            className="btn btn-ghost bg-transparent border-none shadow-none hover:bg-transparent p-0"
            href="/dashboard"
          >
            <img
              src="/nav-icon/logo.png"
              alt="Company Logo"
              className="w-10 mx-auto"
            />
          </a>
          <a
            href="https://digital-card-5a0e5.web.app/"
            className="font-bold text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Site
          </a>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Notification dropdown */}
        <NotificationDropdown />

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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/dashboard/edit-your-profile">Edit Profile</Link>
            </li>
            <li>
              <a>Settings</a>
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
