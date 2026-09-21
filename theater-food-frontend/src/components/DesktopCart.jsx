import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import { useCart } from "../context/CartContext";
import { getCustomerSession } from "../utils/session";

export default function DesktopCart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const session = getCustomerSession();

  return (
    <aside className="desktop-cart-sidebar">
      <div className="desktop-cart-header">
        <div>
          <h3>In-Seat Tray</h3>
          <span className="cart-item-count-label">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>
        {cartItems.length > 0 && (
          <button
            type="button"
            className="clear-cart-btn"
            onClick={clearCart}
            title="Empty Tray"
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="desktop-cart-content">
          <div className="desktop-cart-items-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="desktop-cart-footer">
            <CartSummary subtotal={cartTotal} seatNumber={session?.seat} />

            <button
              type="button"
              className="primary-btn checkout-submit-btn"
              onClick={() => navigate("/checkout")}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
