// main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import "./index.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard/Dashboard";
import HandleOrders from "./pages/DashBoard/HandleOrders";
import EditProducts from "./pages/DashBoard/EditProducts";
import EditProfile from "./pages/DashBoard/EditProfile";
import AddProducts from "./pages/DashBoard/AddProducts";
import AllProductsAdminView from "./pages/DashBoard/AllProductsAdminView";
import UpdateProduct from "./pages/DashBoard/UpdateProduct";
import CartPage from "./pages/CartPage";
import ProductDetails from "./components/ProductDetails";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./Layout/MainLayout";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "./pages/DashBoard/DashboardLayout";
import InvoicePage from "./pages/DashBoard/InvoicePage";
import ViewOrder from "./pages/DashBoard/ViewOrder";
import OrdersProvider from "./context/OrdersProvider";

// 📌 Analytics imports
import { initGA, trackPage } from "./analytics/ga4";
import { initMetaPixel, trackMetaEvent } from "./analytics/metaPixel";
import MarketingTools from "./pages/DashBoard/MarketingTools";
import api from "./api";

// Section refs
const profileRef = { current: null };
const allProductsRef = { current: null };
const contactRef = { current: null };

// Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout refs={{ profileRef, allProductsRef, contactRef }}>
        <Home refs={{ profileRef, allProductsRef, contactRef }} />
      </MainLayout>
    ),
  },
  { path: "/login", element: <Login /> },
  {
    path: "/cart",
    element: (
      <MainLayout>
        <CartPage />
      </MainLayout>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <MainLayout>
        <ProductDetails />
      </MainLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardLayout /> },
      { path: "handle-orders", element: <HandleOrders /> },
      { path: "all-orders", element: <HandleOrders /> },
      { path: "pending-orders", element: <HandleOrders /> },
      { path: "processing-orders", element: <HandleOrders /> },
      { path: "completed-orders", element: <HandleOrders /> },
      { path: "canceled-orders", element: <HandleOrders /> },
      { path: "marketing-tools", element: <MarketingTools /> },

      { path: "edit-your-products", element: <EditProducts /> },
      { path: "edit-your-profile", element: <EditProfile /> },
      { path: "edit-your-products/add", element: <AddProducts /> },
      { path: "edit-your-products/all", element: <AllProductsAdminView /> },
      { path: "update-product/:id", element: <UpdateProduct /> },
      { path: "view-order/:id", element: <ViewOrder /> },
      { path: "invoice/:id", element: <InvoicePage /> },
    ],
  },
]);

// Wrapper for tracking page changes
function AnalyticsWrapper() {
  const location = useLocation();

  useEffect(() => {
    const initAnalytics = async () => {
      const res = await api.get("/marketing-tools");
      const settings = res.data;

      if (settings.gaMeasurementId) {
        initGA(settings.gaMeasurementId);
      }
      if (settings.metaPixelId) {
        initMetaPixel(settings.metaPixelId);
      }
    };
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPage(location.pathname);
    trackMetaEvent("PageView");
  }, [location]);

  return null;
}


// Root render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>
          <RouterProvider router={router}>
            <AnalyticsWrapper /> 
          </RouterProvider>
          <ToastContainer position="top-right" autoClose={2000} />
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  </StrictMode>
);
