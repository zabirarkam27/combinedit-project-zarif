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
    <div className="drawer lg:drawer-open">
      {/* drawer toggle for mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col ">
        <AdminNav />
        <div className="min-h-screen w-full px-6 py-6">
          <Outlet /> {/* Child routes render here */}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side mt-15">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-[#ebf0f0] border-r-white text-base-content relative">
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
              className="btn text-center text-white font-semibold px-4 py-3 rounded-b-xl bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e] bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-right"
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
