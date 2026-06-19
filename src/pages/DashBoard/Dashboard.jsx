import { Link, useNavigate, Outlet } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import AdminNav from "./AdminNav";

const Dashboard = () => {
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
    <div className="drawer lg:drawer-open lg:h-screen lg:overflow-hidden">
      {/* drawer toggle for mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
        <AdminNav />
        <main className="min-h-screen w-full overflow-x-hidden px-0 py-0 md:px-3 md:py-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-[80] lg:sticky lg:top-0 lg:z-40 lg:h-screen lg:overflow-y-auto">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu relative h-full min-h-full w-64 overflow-y-auto border-r-white theme-dashboard-bg p-4 pt-20 text-base-content lg:min-h-screen lg:pt-4">
          <li className="border-b-2 border-gray-300">
            <Link to="/dashboard">Dashboard Home</Link>
          </li>
          <li className="border-b-2 border-gray-300">
            <Link to="/dashboard/handle-orders">Handle Orders</Link>
          </li>
          <li className="border-b-2 border-gray-300">
            <Link to="/dashboard/edit-your-products">Edit Products</Link>
          </li>
          <li className="border-b-2 border-gray-300">
            <Link to="/dashboard/edit-your-profile">Edit Profile</Link>
          </li>
          <li className="border-b-2 border-gray-300">
            <Link to="/dashboard/marketing-tools">Marketing Tools</Link>
          </li>
          <li className="border-b-2 border-gray-300">
            <Link to="/dashboard/settings">Settings</Link>
          </li>
          <ul className="collapse collapse-arrow p-0 mb-2">
            <input type="checkbox" />
            <div className="collapse-title pl-3">Landing Page</div>
            <div className="collapse-content flex flex-col pl-6 w-full">
              <li className="border-b-2 border-gray-300 w-full block">
                <Link to="/dashboard/create-landing">Create New</Link>
              </li>
              <li className="border-b-2 border-gray-300 w-full block">
                <Link to="/dashboard/existing-pages">Existing Pages</Link>
              </li>
            </div>
          </ul>
          <li>
            <button
              onClick={handleLogout}
              className="btn text-center text-white font-semibold px-4 py-3 rounded-b-xl theme-gradient theme-gradient-hover"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
