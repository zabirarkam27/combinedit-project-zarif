import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard/Dashboard";
import ProductDetails from "./components/ProductDetails";
import EditProfile from "./pages/DashBoard/EditProfile";
import EditProducts from "./pages/DashBoard/EditProducts";
import UpdateProduct from "./pages/DashBoard/UpdateProduct";
import AllProductsAdminView from "./pages/DashBoard/AllProductsAdminView";
import AddProducts from "./pages/DashBoard/AddProducts";
import HandleOrders from "./pages/DashBoard/HandleOrders";
import CartPage from "./pages/CartPage";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PrivateRoute from "./components/PrivateRoute";

import MainLayout from "./Layout/MainLayout";

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
  {
    path: "/products/:id",
    element: (
      <MainLayout>
        <ProductDetails />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cart",
    element: (
      <MainLayout>
        <CartPage />
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
  },
  {
    path: "/dashboard/edit-your-profile",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/edit-your-products",
    element: (
      <PrivateRoute>
        <EditProducts />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/handle-orders",
    element: (
      <PrivateRoute>
        <HandleOrders />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/edit-your-products/add",
    element: (
      <PrivateRoute>
        <AddProducts />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/edit-your-products/all",
    element: (
      <PrivateRoute>
        <AllProductsAdminView />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/update-product/:id",
    element: (
      <PrivateRoute>
        <UpdateProduct />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
