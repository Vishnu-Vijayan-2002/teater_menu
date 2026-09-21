import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  CheckCircle2,
  User,
  Phone,
  Armchair,
  Monitor,
  ChevronRight,
  Sparkles,
  Film,
} from "lucide-react";
import Header from "../components/Header";
import CartSummary from "../components/CartSummary";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { getCustomerSession, saveCustomerSession } from "../utils/session";
import { calculateTaxesAndFees } from "../utils/currency";
import { validatePhoneNumber, validateSeatNumber } from "../utils/validation";

const screens = [
  "Screen 1 (Dolby Atmos)",
  "Screen 2 (Laser 4K)",
  "IMAX Experience",
  "VIP Gold Class",
];

const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const session = getCustomerSession() || {};

  const [customerName, setCustomerName] = useState(session.customerName || "");
  const [phone, setPhone] = useState(session.phone || "");
  const [selectedRow, setSelectedRow] = useState(
    session.seat ? session.seat[0] : "C"
  );
  const [seatNumber, setSeatNumber] = useState(
    session.seat ? session.seat.slice(1) : ""
  );
  const [screen, setScreen] = useState(session.screen || "Screen 1 (Dolby Atmos)");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [instructions, setInstructions] = useState("");
  const [contactDetailsConfirmed, setContactDetailsConfirmed] = useState(false);
  const [whatsappUpdatesConfirmed, setWhatsappUpdatesConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fullSeat = `${selectedRow}${seatNumber}`.toUpperCase();
  const { total } = calculateTaxesAndFees(cartTotal);
  const whatsappConfirmationsComplete = contactDetailsConfirmed && whatsappUpdatesConfirmed;

  if (cartItems.length === 0) {
    return (
      <div className="customer-page-layout">
        <Header />
        <main className="cart-page-main">
          <div className="cart-page-container empty-state-pad" style={{ textAlign: "center", paddingTop: "80px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(0, 82, 255, 0.15)", border: "1px solid rgba(0, 82, 255, 0.3)",
              display: "grid", placeItems: "center", margin: "0 auto 20px", color: "#fff"
            }}>
              <Film size={32} />
            </div>
            <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "26px", margin: "0 0 10px" }}>
              Your Tray is Empty
            </h2>
            <p style={{ color: "#777", fontSize: "14px", marginBottom: "28px" }}>
              Add some gourmet items to your tray before checking out.
            </p>
            <Link to="/menu" className="primary-btn">
              Browse the Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!seatNumber || !validateSeatNumber(fullSeat)) {
      setError("Please select a row and enter a valid seat number (e.g. C12).");
      return;
    }

    const wantsSavedProfile = contactDetailsConfirmed && whatsappUpdatesConfirmed;

    if (!wantsSavedProfile) {
      setError("Please confirm both WhatsApp options to continue with your order.");
      return;
    }

    if (wantsSavedProfile && !customerName.trim()) {
      setError("Please enter your name to save your contact profile.");
      return;
    }

    if (wantsSavedProfile && !phone.trim()) {
      setError("Please enter your mobile number to receive updates or offers.");
      return;
    }

    if (phone && !validatePhoneNumber(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setIsSubmitting(true);

      saveCustomerSession({
        customerName: wantsSavedProfile ? customerName.trim() : "",
        phone: wantsSavedProfile ? phone.trim() : "",
        seat: fullSeat,
        screen,
        whatsappOptIn: true,
        marketingOptIn: false,
        contactDetailsConfirmed,
        whatsappUpdatesConfirmed,
      });

      const orderPayload = {
        customerName: wantsSavedProfile ? customerName.trim() : "Cinema Guest",
        phone: wantsSavedProfile ? phone.trim() : "N/A",
        seat: fullSeat,
        screen,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total,
        paymentMethod,
        instructions: instructions.trim(),
        whatsappOptIn: true,
        marketingOptIn: false,
        contactDetailsConfirmed,
        whatsappUpdatesConfirmed,
        status: "RECEIVED",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const newOrder = await placeOrder(orderPayload);
      clearCart();
      navigate(`/order/${newOrder.id}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      setError("Unable to process your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-page-layout">
      <Header />

      <main className="checkout-page-main">
        <div className="checkout-page-container">

          {/* Nav */}
          <div className="checkout-nav-bar">
            <Link to="/cart" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Tray</span>
            </Link>
          </div>

          {/* Page Title */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#0052ff", border: "1px solid #0052ff",
              color: "#fff", padding: "5px 12px", borderRadius: "20px",
              fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px",
              marginBottom: "12px"
            }}>
              <Sparkles size={12} />
              IN-SEAT CONCESSION ORDER
            </div>
            <h1 className="checkout-main-title">Confirm Your Order</h1>
            <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
              Fill in your seat details and payment preference below.
            </p>
          </div>

          {error && <div className="checkout-error-alert">{error}</div>}

          <form className="checkout-layout-grid" onSubmit={handlePlaceOrder}>

            {/* ── LEFT COLUMN ── */}
            <div className="checkout-form-column">

              {/* ── STEP 1: Seat Location ── */}
              <div className="co-step-card">
                <div className="co-step-header">
                  <div className="co-step-number">1</div>
                  <div>
                    <h3 className="co-step-title">Your Seat Location</h3>
                    <p className="co-step-sub">Where should we deliver your order?</p>
                  </div>
                </div>

                {/* Screen selector */}
                <div className="co-field">
                  <label className="co-label">
                    <Monitor size={13} /> Auditorium / Screen
                  </label>
                  <div className="co-screen-pills">
                    {screens.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`co-screen-pill ${screen === s ? "active" : ""}`}
                        onClick={() => setScreen(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row + Seat Number */}
                <div className="co-field">
                  <label className="co-label">
                    <Armchair size={13} /> Select Row &amp; Seat Number
                  </label>
                  <div className="co-row-pills">
                    {seatRows.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`co-row-pill ${selectedRow === r ? "active" : ""}`}
                        onClick={() => setSelectedRow(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="co-seat-input-row">
                    <div className="co-seat-addon">
                      <Armchair size={16} />
                      <span>Row {selectedRow}</span>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      placeholder="Seat No. (e.g. 12)"
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      className="co-seat-number-input"
                    />
                    {seatNumber && (
                      <div className="co-seat-preview">
                        <Armchair size={14} />
                        <strong>{fullSeat}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── STEP 2: Guest Details ── */}
              <div className="co-step-card">
                <div className="co-step-header">
                  <div className="co-step-number">2</div>
                  <div>
                    <h3 className="co-step-title">Guest Details</h3>
                    <p className="co-step-sub">Optional — for delivery updates &amp; offers</p>
                  </div>
                </div>

                <div className="co-two-col">
                  <div className="co-field">
                    <label className="co-label"><User size={13} /> Name</label>
                    <div className="co-input-wrap">
                      <User size={15} className="co-input-icon" />
                      <input
                        type="text"
                        placeholder=""
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="co-input"
                      />
                    </div>
                  </div>
                  <div className="co-field">
                    <label className="co-label"><Phone size={13} /> Mobile number</label>
                    <div className="co-input-wrap">
                      <Phone size={15} className="co-input-icon" />
                      <input
                        type="tel"
                        placeholder=""
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="co-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Consent toggles */}
                <div className="co-toggles">
                  <label className="co-toggle-row">
                    <input
                      type="checkbox"
                      checked={contactDetailsConfirmed}
                      onChange={(e) => setContactDetailsConfirmed(e.target.checked)}
                      className="co-checkbox"
                    />
                    <span className="co-toggle-dot" style={{ background: contactDetailsConfirmed ? "#25D366" : "#333" }} />
                    <span className="co-toggle-label">
                      I confirm my name &amp; WhatsApp number and allow them to be saved for order communication.
                    </span>
                  </label>
                  <label className="co-toggle-row">
                    <input
                      type="checkbox"
                      checked={whatsappUpdatesConfirmed}
                      onChange={(e) => setWhatsappUpdatesConfirmed(e.target.checked)}
                      className="co-checkbox"
                    />
                    <span className="co-toggle-dot" style={{ background: whatsappUpdatesConfirmed ? "#25D366" : "#333" }} />
                    <span className="co-toggle-label">
                      I agree to receive my order details and status updates on WhatsApp.
                    </span>
                  </label>
                </div>

                <p style={{ margin: "12px 0 0", color: "#9ca3af", fontSize: "11px", lineHeight: 1.5 }}>
                  Both confirmations are required to place your order. These permissions are only for completing and communicating this order, not promotional messages.
                </p>

                <div className="co-field" style={{ marginTop: "14px" }}>
                  <label className="co-label">Special Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Extra napkins, deliver during intermission"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="co-text-input"
                  />
                </div>
              </div>

              {/* ── STEP 3: Payment ── */}
              <div className="co-step-card">
                <div className="co-step-header">
                  <div className="co-step-number">3</div>
                  <div>
                    <h3 className="co-step-title">Payment Method</h3>
                    <p className="co-step-sub">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="co-payment-list">
                  <label className={`co-payment-card ${paymentMethod === "UPI" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      style={{ display: "none" }}
                    />
                    <div className="co-payment-icon">
                      <CreditCard size={20} />
                    </div>
                    <div className="co-payment-body">
                      <strong>UPI / Online Payment</strong>
                      <p>Google Pay · PhonePe · Paytm — scan QR or approve notification</p>
                    </div>
                    {paymentMethod === "UPI" && (
                      <div className="co-payment-check"><CheckCircle2 size={18} /></div>
                    )}
                    <span className="co-instant-badge">Instant</span>
                  </label>

                  <label className={`co-payment-card ${paymentMethod === "SEAT_PAY" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="SEAT_PAY"
                      checked={paymentMethod === "SEAT_PAY"}
                      onChange={() => setPaymentMethod("SEAT_PAY")}
                      style={{ display: "none" }}
                    />
                    <div className="co-payment-icon">
                      <Banknote size={20} />
                    </div>
                    <div className="co-payment-body">
                      <strong>Pay at Seat</strong>
                      <p>Cash or card — our attendant brings a wireless payment machine</p>
                    </div>
                    {paymentMethod === "SEAT_PAY" && (
                      <div className="co-payment-check"><CheckCircle2 size={18} /></div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Summary ── */}
            <div className="checkout-summary-column">
              <div className="co-summary-sticky">

                {/* Seat Preview Card */}
                {seatNumber && (
                  <div className="co-seat-confirm-card">
                    <div className="co-seat-confirm-icon">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "800", color: "#fff", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>
                        Delivering To
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: "800", color: "#fff" }}>
                        {screen.replace(/\(.*\)/, "").trim()} · Seat {fullSeat}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="co-order-summary-card">
                  <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#fff" }}>
                    Order ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                  </h3>

                  <div className="co-items-list">
                    {cartItems.map((item) => (
                      <div className="co-item-row" key={item.id}>
                        <span className="co-item-qty">{item.quantity}×</span>
                        <span className="co-item-name">{item.name}</span>
                        <span className="co-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <CartSummary subtotal={cartTotal} seatNumber={fullSeat || session?.seat} />

                  <button
                    type="submit"
                    className="primary-btn checkout-submit-btn"
                    style={{ width: "100%", marginTop: "16px", padding: "15px", fontSize: "15px" }}
                    disabled={isSubmitting || !whatsappConfirmationsComplete}
                  >
                    <CheckCircle2 size={18} />
                    <span>
                      {isSubmitting ? "Placing Order…" : `Place Order · ₹${total}`}
                    </span>
                    {!isSubmitting && <ChevronRight size={18} />}
                  </button>

                  {!whatsappConfirmationsComplete && (
                    <p style={{ margin: "10px 0 0", color: "#d97733", fontSize: "11px", textAlign: "center", fontWeight: 650 }}>
                      Please confirm both WhatsApp options to continue with your order.
                    </p>
                  )}

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "6px", fontSize: "11px", color: "#555", marginTop: "12px"
                  }}>
                    <ShieldCheck size={13} />
                    <span>Secure in-seat delivery guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
