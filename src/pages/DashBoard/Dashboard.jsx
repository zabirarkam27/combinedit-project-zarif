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
          <li>
            <Link to="/dashboard">Dashboard Home</Link>
          </li>
          <li>
            <Link to="/dashboard/handle-orders">Handle Orders</Link>
          </li>
          <li>
            <Link to="/dashboard/edit-your-products">Edit Products</Link>
          </li>
          <li>
            <Link to="/dashboard/edit-your-profile">Edit Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/marketing-tools">Marketing Tools</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="btn btn-error text-white">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
