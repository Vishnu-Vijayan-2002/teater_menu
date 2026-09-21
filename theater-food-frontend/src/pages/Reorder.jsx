import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Check, ShoppingBag, AlertCircle, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import { getReorderData } from "../services/orderService";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { saveCustomerSession } from "../utils/session";

export default function Reorder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  const [reorderData, setReorderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getReorderData(orderId);
        if (!data) {
          setError("Previous order record not found.");
        } else {
          setReorderData(data);
          // Preserve seat session
          if (data.seat) {
            saveCustomerSession({
              seat: data.seat,
              screen: data.screen || "Screen 1",
              customerName: data.customerName || "Cinema Guest",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load reorder:", err);
        setError("Unable to retrieve past order.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const handleConfirmReorder = () => {
    if (!reorderData || !reorderData.items) return;

    // Clear existing tray to load exact reorder
    clearCart();

    // Add in-stock items with verified live price
    reorderData.items
      .filter((i) => i.available !== false)
      .forEach((item) => {
        addToCart(item, item.quantity || 1);
      });

    navigate("/checkout");
  };

  const calculateReorderSubtotal = () => {
    if (!reorderData?.items) return 0;
    return reorderData.items
      .filter((i) => i.available !== false)
      .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  };

  return (
    <div className="customer-page-layout">
      <Header />

      <main className="cart-page-main">
        <div className="cart-page-container">
          <div className="cart-nav-bar">
            <Link to="/menu" className="back-link">
              <ArrowLeft size={16} />
              <span>Explore Full Menu</span>
            </Link>
          </div>

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: "rgba(0, 82, 255, 0.15)",
                color: "#fff",
                border: "1px solid #0052ff",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              <RotateCcw size={14} />
              <span>Verified 1-Click Reorder</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", margin: "0 0 8px", color: "#fff" }}>
              Order Your Favorites Again
            </h1>
            <p style={{ color: "var(--cinema-muted)", fontSize: "14px", margin: 0 }}>
              Live inventory and pricing verified for your cinema seat.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div className="admin-loading-spinner" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#888" }}>Verifying live theater menu &amp; stock...</p>
            </div>
          ) : error ? (
            <div className="empty-cart-container">
              <AlertCircle size={40} color="var(--cinema-red)" />
              <h3 style={{ marginTop: "14px" }}>{error}</h3>
              <p>You can browse our fresh current menu and pick your concessions directly.</p>
              <Link to="/menu" className="primary-btn mt-3">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="cart-items-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid var(--cinema-border)" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    From Order <strong>#{reorderData.sourceOrderId}</strong>
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--cinema-gold)", fontWeight: "700" }}>
                    {reorderData.screen} • Seat {reorderData.seat}
                  </span>
                </div>

                {reorderData.items.map((item, idx) => (
                  <div key={idx} className="cart-item-row">
                    <div className="cart-item-img-wrap">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <div className="cart-item-price-unit">
                        {item.quantity}x @ {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div>
                      {item.available !== false ? (
                        <span style={{ fontSize: "11px", color: "#2ecc71", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Check size={13} /> Fresh in Stock
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#e74c3c" }}>Sold out</span>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", marginTop: "4px", borderTop: "1px solid var(--cinema-border)" }}>
                  <span style={{ color: "#aaa", fontSize: "14px" }}>Current Subtotal</span>
                  <strong style={{ color: "var(--cinema-gold)", fontSize: "18px" }}>
                    {formatCurrency(calculateReorderSubtotal())}
                  </strong>
                </div>

                <button
                  type="button"
                  className="primary-btn checkout-submit-btn"
                  onClick={handleConfirmReorder}
                  style={{ marginTop: "12px" }}
                >
                  <ShoppingBag size={18} />
                  <span>Confirm Tray &amp; Order to Seat {reorderData.seat}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
