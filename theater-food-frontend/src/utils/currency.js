/**
 * Currency utility functions for INR theater menu pricing
 */

export function formatCurrency(amount) {
  const numeric = typeof amount === "number" ? amount : Number(amount) || 0;
  return `₹${numeric.toLocaleString("en-IN")}`;
}

export function calculateSubtotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);
}

export function calculateTaxesAndFees(subtotal) {
  const gstRate = 0.05; // 5% GST on theater food/beverages
  const convenienceFee = subtotal > 0 ? 20 : 0; // Flat ₹20 convenience & in-seat delivery fee
  const tax = Math.round(subtotal * gstRate);
  const total = subtotal + tax + convenienceFee;

  return {
    subtotal,
    tax,
    convenienceFee,
    total,
  };
}
