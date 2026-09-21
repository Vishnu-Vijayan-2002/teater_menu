import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Film, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { getCustomerSession } from "../utils/session";
import { useTheaterConfig } from "../utils/theaterConfig";

export default function Header({ onOpenSeatModal }) {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { activeOrderId } = useOrder();
  const session = getCustomerSession();
  const theater = useTheaterConfig();

  const seatText = session?.seat
    ? `${session.screen || "Screen 1"} • Seat ${session.seat}`
    : "Select Seat";

  return (
    <header className="customer-header">
      <div className="customer-header-container">
        {/* Brand */}
        <Link to="/menu" className="customer-brand">
          <div className="brand-logo-icon">
            {theater.logo ? <img src={theater.logo} alt={`${theater.name} logo`} /> : <Film size={20} />}
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">{theater.name}</span>
            <span className="brand-subtitle">GOURMET &amp; LOUNGE</span>
          </div>
        </Link>

        {/* Center: Seat Selector Badge */}
        <div className="header-seat-badge-wrap">
          <button
            type="button"
            className="seat-selector-badge"
            onClick={onOpenSeatModal || (() => navigate("/checkout"))}
            title="Click to update in-theater seat"
          >
            <MapPin size={14} className="seat-icon" />
            <span className="seat-text">{seatText}</span>
            <span className="seat-change-hint">Change</span>
          </button>
        </div>

        {/* Right: Active Order Link + Cart Button */}
        <div className="header-right-actions">
          {activeOrderId && (
            <Link
              to={`/order/${activeOrderId}`}
              className="active-order-pill"
              title="Track Active Order"
            >
              <Clock size={14} className="pulse-icon" />
              <span>Live Order</span>
            </Link>
          )}

          <Link to="/cart" className="customer-cart-btn" aria-label="View Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="cart-badge-count">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
