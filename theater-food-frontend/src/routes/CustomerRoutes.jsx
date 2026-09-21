import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderTracking from "../pages/OrderTracking";
import Reorder from "../pages/Reorder";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" replace />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order/:orderId" element={<OrderTracking />} />
      <Route path="/reorder/:orderId" element={<Reorder />} />
    </Routes>
  );
}
