import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppRoutes />
          </OrderProvider>
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;