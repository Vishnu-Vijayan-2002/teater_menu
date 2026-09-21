import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  CookingPot,
  Sparkles,
  MapPin,
  Film,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Header from "../components/Header";
import { getOrderById, updateOrderStatus, subscribeToOrder } from "../services/orderService";
import { formatCurrency } from "../utils/currency";
import { useTheaterConfig } from "../utils/theaterConfig";

const statusSteps = [
  {
    key: "RECEIVED",
    label: "Order Confirmed",
    desc: "Sent to theater kitchen",
    icon: CheckCircle2,
  },
  {
    key: "PREPARING",
    label: "Freshly Preparing",
    desc: "Kitchen is preparing your items",
    icon: CookingPot,
  },
  {
    key: "READY",
    label: "Attendant En Route",
    desc: "Tray packed, heading to auditorium",
    icon: Clock3,
  },
  {
    key: "DELIVERED",
    label: "Delivered to Seat",
    desc: "Delivered! Enjoy your movie",
    icon: Sparkles,
  },
];

export default function OrderTracking() {
  const theater = useTheaterConfig();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;
    async function load() {
      try {
        const found = await getOrderById(orderId);
        if (found) {
          setOrder(found);
        }
        unsubscribe = subscribeToOrder(orderId, (updated) => {
          if (updated) setOrder(updated);
        });
      } catch (err) {
        console.error("Tracking load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [orderId]);

  // Demo helper: Allows testing transitions directly on the page
  const handleSimulateStatus = async (newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.key === (order?.status || "RECEIVED")
  );

  return (
    <div className="customer-page-layout">
      <Header />

      <main className="tracking-page-main">
        <div className="tracking-page-container">
          {loading ? (
            <div className="tracking-loading-state">
              <div className="admin-loading-spinner" />
              <p>Locating order #{orderId}...</p>
            </div>
          ) : !order ? (
            <div className="tracking-empty-card">
              <h2>Order Not Found</h2>
              <p>We couldn't find an order with ID #{orderId}.</p>
              <Link to="/menu" className="primary-btn mt-3">
                Return to Menu
              </Link>
            </div>
          ) : (
            <div className="tracking-layout-grid">
              {/* Main Tracking Card */}
              <div className="tracking-card">
                <div className="tracking-header">
                  <div className="tracking-order-badge">
                    <span className="badge-live-pulse" />
                    <span>LIVE STATUS</span>
                  </div>

                  <h1 className="tracking-order-id">{order.id}</h1>
                  <p className="tracking-timestamp">Placed at {order.time || "Just now"}</p>
                </div>

                {/* Status Timeline */}
                <div className="tracking-timeline">
                  {statusSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;

                    return (
                      <div
                        key={step.key}
                        className={`timeline-step ${isCompleted ? "completed" : ""} ${
                          isCurrent ? "current" : ""
                        }`}
                      >
                        <div className="step-marker">
                          <div className="step-icon-bubble">
                            <StepIcon size={18} />
                          </div>
                          {idx < statusSteps.length - 1 && <div className="step-connector-line" />}
                        </div>

                        <div className="step-details">
                          <h4 className="step-title">{step.label}</h4>
                          <p className="step-desc">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Location Confirmation */}
                <div className="tracking-seat-banner">
                  <div className="seat-banner-icon">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <span className="seat-banner-label">DELIVERING TO YOUR SEAT</span>
                    <h3 className="seat-banner-value">
                      {order.screen || "Screen 1"} • Row {order.seat || "Unassigned"}
                    </h3>
                  </div>
                </div>

                {/* Interactive Status Simulation for Testing */}
                <div className="tracking-demo-simulator">
                  <span className="simulator-label">Test Live Attendant Simulation:</span>
                  <div className="simulator-buttons">
                    {statusSteps.map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        className={`sim-btn ${order.status === st.key ? "sim-btn-active" : ""}`}
                        onClick={() => handleSimulateStatus(st.key)}
                      >
                        {st.key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary Details */}
              <div className="tracking-summary-card">
                <h3>Order Details</h3>

                <div className="tracking-items-list">
                  {order.items?.map((item, idx) => (
                    <div className="tracking-item-row" key={idx}>
                      <div className="tracking-item-name-qty">
                        <span className="item-qty-tag">{item.quantity}x</span>
                        <span className="item-name-text">{item.name}</span>
                      </div>
                      <span className="item-price-text">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="tracking-bill-divider" />

                <div className="tracking-bill-row total">
                  <strong>Total Paid / Due</strong>
                  <strong className="tracking-total-amount">{formatCurrency(order.total)}</strong>
                </div>

                <div className="tracking-guest-meta">
                  <span>Guest: {order.customerName || "Cinema Guest"}</span>
                  <span>Payment: {order.paymentMethod || "UPI"}</span>
                </div>

                <Link to="/menu" className="secondary-btn order-more-btn">
                  <span>Order More Concessions</span>
                  <ArrowRight size={16} />
                </Link>

                {/* WhatsApp Notification Simulation (Phase 2 Preview) */}
                <div style={{ marginTop: "24px", padding: "16px", background: "rgba(37, 211, 102, 0.06)", border: "1px solid rgba(37, 211, 102, 0.25)", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#25D366" }} />
                      <strong style={{ fontSize: "11px", color: "#25D366", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        WhatsApp Alert Sent
                      </strong>
                    </div>
                    <span style={{ fontSize: "10px", color: "#888" }}>Live Preview</span>
                  </div>

                  <div style={{ background: "#111b21", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "#e9edef", lineHeight: "1.5" }}>
                    <div style={{ color: "#25D366", fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      🎬 {theater.name}
                    </div>
                    <p style={{ margin: "0 0 8px" }}>
                      Hi <strong>{order.customerName || "Guest"}</strong>, your order <strong>#{order.id}</strong> has been {order.status === "DELIVERED" ? "delivered to your seat! 🍿" : "received by the kitchen."}
                    </p>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <Link
                        to={`/reorder/${order.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          background: "#00a884",
                          color: "#111b21",
                          fontWeight: "700",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                      >
                        🍿 ORDER AGAIN (1-Click Reorder)
                      </Link>

                      <Link
                        to="/menu"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          background: "rgba(0, 82, 255, 0.15)",
                          color: "#fff",
                          border: "1px solid #0052ff",
                          fontWeight: "600",
                          padding: "7px 12px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "11px",
                        }}
                      >
                        🔥 VIEW CONCESSION OFFERS
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
