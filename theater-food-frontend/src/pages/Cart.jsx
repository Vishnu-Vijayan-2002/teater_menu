import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Trash2, MapPin } from "lucide-react";
import Header from "../components/Header";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyCart from "../components/EmptyCart";
import { useCart } from "../context/CartContext";
import { getCustomerSession } from "../utils/session";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const session = getCustomerSession();

  return (
    <div className="customer-page-layout">
      <Header />

      <main className="cart-page-main">
        <div className="cart-page-container">
          {/* Top navigation */}
          <div className="cart-nav-bar">
            <Link to="/menu" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Menu</span>
            </Link>
            {cartItems.length > 0 && (
              <button
                type="button"
                className="clear-cart-btn"
                onClick={clearCart}
                title="Clear tray"
              >
                <Trash2 size={15} />
                <span>Clear Tray</span>
              </button>
            )}
          </div>

          <div className="cart-title-row">
            <h1>Your In-Seat Tray</h1>
            <span className="cart-item-count-badge">
              {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart onBrowse={() => navigate("/menu")} />
          ) : (
            <div className="cart-layout-grid">
              {/* Items List */}
              <div className="cart-items-column">
                <div className="cart-items-card">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Delivery Target Card */}
                <div className="cart-delivery-card">
                  <div className="delivery-card-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="delivery-card-text">
                    <strong>Direct-to-Seat Concession</strong>
                    <p>
                      Delivering to:{" "}
                      <span className="highlight-seat">
                        {session?.seat
                          ? `${session.screen || "Screen 1"} • Seat ${session.seat}`
                          : "Choose your seat at Checkout"}
                      </span>
                    </p>
                  </div>
                  <Link to="/checkout" className="edit-seat-link">
                    {session?.seat ? "Change" : "Select"}
                  </Link>
                </div>
              </div>

              {/* Order Bill Summary */}
              <div className="cart-sidebar-column">
                <CartSummary subtotal={cartTotal} seatNumber={session?.seat} />

                <button
                  type="button"
                  className="primary-btn checkout-submit-btn"
                  onClick={() => navigate("/checkout")}
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
