import { createContext, useContext, useState, useEffect } from "react";
import { createOrder, getOrderById, updateOrderStatus, subscribeToOrder } from "../services/orderService";

const OrderContext = createContext(null);
const ACTIVE_ORDER_ID_KEY = "cinema_active_order_id";

export function OrderProvider({ children }) {
  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem(ACTIVE_ORDER_ID_KEY) || null;
  });
  const [activeOrder, setActiveOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (!activeOrderId) {
      setActiveOrder(null);
      return;
    }

    setLoadingOrder(true);
    // Subscribe to live status
    const unsubscribe = subscribeToOrder(activeOrderId, (order) => {
      setActiveOrder(order);
      setLoadingOrder(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [activeOrderId]);

  const placeOrder = async (orderPayload) => {
    const placed = await createOrder(orderPayload);
    setActiveOrderId(placed.id);
    setActiveOrder(placed);
    localStorage.setItem(ACTIVE_ORDER_ID_KEY, placed.id);
    return placed;
  };

  const trackOrder = async (orderId) => {
    setActiveOrderId(orderId);
    localStorage.setItem(ACTIVE_ORDER_ID_KEY, orderId);
    setLoadingOrder(true);
    const order = await getOrderById(orderId);
    setActiveOrder(order);
    setLoadingOrder(false);
    return order;
  };

  const updateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <OrderContext.Provider
      value={{
        activeOrderId,
        activeOrder,
        loadingOrder,
        placeOrder,
        trackOrder,
        updateStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
