import { StrictMode, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";

import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import OrdersProvider from "./context/OrdersProvider";
import { ProfileSectionProvider } from "./context/ProfileSectionContext";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./Layout/MainLayout";
import { initMarketingTools, trackMarketingPageView } from "./analytics/marketingTools";
import api from "./api";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/DashBoard/Dashboard"));
const DashboardLayout = lazy(() => import("./pages/DashBoard/DashboardLayout"));
const HandleOrders = lazy(() => import("./pages/DashBoard/HandleOrders"));
const EditProducts = lazy(() => import("./pages/DashBoard/EditProducts"));
const EditProfile = lazy(() => import("./pages/DashBoard/EditProfile"));
const AddProducts = lazy(() => import("./pages/DashBoard/AddProducts"));
const AllProductsAdminView = lazy(() =>
  import("./pages/DashBoard/AllProductsAdminView")
);
const UpdateProduct = lazy(() => import("./pages/DashBoard/UpdateProduct"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AllProductsPage = lazy(() => import("./pages/AllProductsPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const InvoicePage = lazy(() => import("./pages/DashBoard/InvoicePage"));
const ViewOrder = lazy(() => import("./pages/DashBoard/ViewOrder"));
const MarketingTools = lazy(() => import("./pages/DashBoard/MarketingTools"));
const Settings = lazy(() => import("./pages/DashBoard/Settings"));
const LandingPage = lazy(() =>
  import("./pages/DashBoard/landingPages/LandingPage")
);
const CreateNew = lazy(() => import("./pages/DashBoard/landingPages/CreateNew"));
const ExistingPages = lazy(() =>
  import("./pages/DashBoard/landingPages/ExistingPages")
);

const profileRef = { current: null };
const allProductsRef = { current: null };
const contactRef = { current: null };

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-[#0c2955]">
    Loading...
  </div>
);

const withSuspense = (element) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

function AnalyticsWrapper() {
  const location = useLocation();

  useEffect(() => {
    const initAnalytics = async () => {
      try {
        const res = await api.get("/marketing-tools", { skipAuth: true });
        const settings = res.data || {};
        initMarketingTools(settings);
      } catch (error) {
        console.warn("Marketing analytics settings could not be loaded.");
      }
    };

    initAnalytics();
  }, []);

  useEffect(() => {
    trackMarketingPageView(location.pathname);
  }, [location]);

  return null;
}

function AppFrame({ children }) {
  return (
    <>
      <AnalyticsWrapper />
      {children}
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout refs={{ profileRef, allProductsRef, contactRef }}>
        <AppFrame>
          <Home refs={{ profileRef, allProductsRef, contactRef }} />
        </AppFrame>
      </MainLayout>
    ),
  },
  { path: "/login", element: withSuspense(<Login />) },
  {
    path: "/cart",
    element: (
      <MainLayout>
        <AppFrame>{withSuspense(<CartPage />)}</AppFrame>
      </MainLayout>
    ),
  },
  {
    path: "/landing-page/:id",
    element: (
      <MainLayout>
        <AppFrame>{withSuspense(<LandingPage />)}</AppFrame>
      </MainLayout>
    ),
  },
  {
    path: "/products",
    element: (
      <MainLayout>
        <AppFrame>{withSuspense(<AllProductsPage />)}</AppFrame>
      </MainLayout>
    ),
  },
  {
    path: "/categories",
    element: (
      <MainLayout>
        <AppFrame>{withSuspense(<CategoriesPage />)}</AppFrame>
      </MainLayout>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <MainLayout>
        <AppFrame>{withSuspense(<ProductDetails />)}</AppFrame>
      </MainLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        {withSuspense(
          <AppFrame>
            <Dashboard />
          </AppFrame>
        )}
      </PrivateRoute>
    ),
    children: [
      { index: true, element: withSuspense(<DashboardLayout />) },
      { path: "handle-orders", element: withSuspense(<HandleOrders />) },
      { path: "all-orders", element: withSuspense(<HandleOrders />) },
      { path: "pending-orders", element: withSuspense(<HandleOrders />) },
      { path: "processing-orders", element: withSuspense(<HandleOrders />) },
      { path: "completed-orders", element: withSuspense(<HandleOrders />) },
      { path: "canceled-orders", element: withSuspense(<HandleOrders />) },
      { path: "marketing-tools", element: withSuspense(<MarketingTools />) },
      { path: "settings", element: withSuspense(<Settings />) },
      { path: "edit-your-products", element: withSuspense(<EditProducts />) },
      { path: "edit-your-profile", element: withSuspense(<EditProfile />) },
      { path: "edit-your-products/add", element: withSuspense(<AddProducts />) },
      {
        path: "edit-your-products/all",
        element: withSuspense(<AllProductsAdminView />),
      },
      { path: "update-product/:id", element: withSuspense(<UpdateProduct />) },
      { path: "view-order/:id", element: withSuspense(<ViewOrder />) },
      { path: "invoice/:id", element: withSuspense(<InvoicePage />) },
      { path: "create-landing", element: withSuspense(<CreateNew />) },
      { path: "existing-pages", element: withSuspense(<ExistingPages />) },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <OrdersProvider>
        <CartProvider>
          <ProfileSectionProvider>
            <RouterProvider router={router} />
            <ToastContainer position="top-right" autoClose={2000} />
          </ProfileSectionProvider>
        </CartProvider>
      </OrdersProvider>
    </AuthProvider>
  </StrictMode>
);
