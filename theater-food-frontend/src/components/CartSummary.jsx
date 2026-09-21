import { formatCurrency, calculateTaxesAndFees } from "../utils/currency";

export default function CartSummary({ subtotal, seatNumber }) {
  const { tax, convenienceFee, total } = calculateTaxesAndFees(subtotal);

  return (
    <div className="cart-summary-box">
      <h4 className="summary-title">Bill Details</h4>

      <div className="summary-row">
        <span>Item Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="summary-row">
        <span>GST &amp; Restaurant Tax (5%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>

      <div className="summary-row">
        <span>In-Seat Convenience Fee</span>
        <span>{formatCurrency(convenienceFee)}</span>
      </div>

      {seatNumber && (
        <div className="summary-row seat-row">
          <span>Delivery Seat</span>
          <span className="summary-seat-badge">{seatNumber}</span>
        </div>
      )}

      <div className="summary-divider" />

      <div className="summary-row total-row">
        <strong>To Pay</strong>
        <strong className="summary-total-amount">{formatCurrency(total)}</strong>
      </div>
    </div>
  );
}
