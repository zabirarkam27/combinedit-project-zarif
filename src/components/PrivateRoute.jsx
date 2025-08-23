import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  const adminEmails = [
    import.meta.env.VITE_ADMIN_EMAIL,
    import.meta.env.VITE_ADMIN_GMAIL,
  ];

  if (!adminEmails.includes(user.email)) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
