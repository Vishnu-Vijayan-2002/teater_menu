import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

export default function MobileCartBar() {
  const { itemCount, cartTotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="mobile-cart-bar">
      <div className="mobile-cart-info">
        <div className="cart-badge-icon">
          <ShoppingBag size={18} />
          <span className="cart-qty-badge">{itemCount}</span>
        </div>
        <div className="mobile-cart-pricing">
          <span className="mobile-cart-total">{formatCurrency(cartTotal)}</span>
          <span className="mobile-cart-subtext">plus taxes &amp; fees</span>
        </div>
      </div>

      <Link to="/cart" className="mobile-cart-cta">
        <span>View Tray</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
