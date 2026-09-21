import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderTracking from "../pages/OrderTracking";
import Reorder from "../pages/Reorder";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SalesmanLogin from "../pages/salesman/SalesmanLogin";
import SalesmanDashboard from "../pages/salesman/SalesmanDashboard";

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProtectedSalesmanRoute from "./ProtectedSalesmanRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer — land directly on Menu */}
      <Route
        path="/"
        element={<Navigate to="/menu" replace />}
      />

      <Route
        path="/menu"
        element={<Menu />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/order/:orderId"
        element={<OrderTracking />}
      />

      <Route
        path="/reorder/:orderId"
        element={<Reorder />}
      />

      {/* Admin */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route element={<ProtectedAdminRoute />}>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Route>

      {/* Salesman Portal */}
      <Route
        path="/salesman/login"
        element={<SalesmanLogin />}
      />

      <Route element={<ProtectedSalesmanRoute />}>
        <Route
          path="/salesman/dashboard"
          element={<SalesmanDashboard />}
        />
      </Route>
    </Routes>
  );
}