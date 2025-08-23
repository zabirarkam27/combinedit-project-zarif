import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";

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
    <div className="relative  bg-[#ebf0f0] max-w-2xl mx-auto my-6 rounded-xl flex items-center justify-center flex-col">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-Black my-10">
        Admin Dashboard
      </h1>

      <div className="flex flex-wrap gap-6 justify-center px-10 mb-10">
        {/* Handle Orders */}
        <Link
          to="/dashboard/handle-orders"
          className="group block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-[#cdc3ff] shadow-lg w-full"
        >
          <img
            src="/icons/16.png"
            alt="Handle Orders"
            className="w-full h-48 object-contain p-3 transform transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="
        text-center 
        text-white font-semibold 
        px-4 py-3 
        rounded-b-xl
        bg-gradient-to-r from-[#7154ff] via-[#9172ff] to-[#7154ff] 
        bg-[length:200%_200%] 
        transition-all duration-500 ease-in-out
        hover:bg-right
      "
          >
            Handle Orders
          </div>
        </Link>

        {/* Edit Products */}
        <Link
          to="/dashboard/edit-your-products"
          className="group block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-[#00555a] shadow-lg w-full"
        >
          <img
            src="/icons/36.png"
            alt="Edit Products"
            className="w-full h-48 object-contain p-3 transform transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="
        text-center 
        text-white font-semibold 
        px-4 py-3 
        rounded-b-xl
        bg-gradient-to-r from-[#00555a] via-[#007272] to-[#00555a]
        bg-[length:200%_200%] 
        transition-all duration-500 ease-in-out
        hover:bg-right
      "
          >
            Edit Your Products
          </div>
        </Link>

        {/* Edit Profile */}
        <Link
          to="/dashboard/edit-your-profile"
          className="group block rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-[#b5e4e0] shadow-lg w-full"
        >
          <img
            src="/icons/4.png"
            alt="Edit Profile"
            className="w-full h-48 object-contain p-3 transform transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="
        text-center 
        text-white font-semibold 
        px-4 py-3 
        rounded-b-xl
        bg-gradient-to-r from-[#00ad9c] via-[#3a8881] to-[#009e8e]
        bg-[length:200%_200%] 
        transition-all duration-500 ease-in-out
        hover:bg-right
      "
          >
            Edit Your Profile
          </div>
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#696b6e] text-white font-semibold py-4 max-w-full w-9/10 mb-8 hover:bg-black transition rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
