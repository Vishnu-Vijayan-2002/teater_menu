import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart({ onBrowse }) {
  return (
    <div className="empty-cart-container">
      <div className="empty-cart-icon-wrapper">
        <ShoppingBag size={48} className="empty-cart-icon" />
      </div>
      <h3>Your In-Seat Tray is Empty</h3>
      <p>Elevate your movie experience with our fresh gourmet popcorn, chilled drinks, and cinema bites.</p>
      {onBrowse ? (
        <button type="button" className="primary-btn browse-menu-btn" onClick={onBrowse}>
          Browse Menu <ArrowRight size={16} />
        </button>
      ) : (
        <Link to="/menu" className="primary-btn browse-menu-btn">
          Browse Menu <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
