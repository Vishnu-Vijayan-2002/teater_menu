/**
 * Input validation helpers for cinema ordering
 */

export function validateSeatNumber(seat) {
  if (!seat || typeof seat !== "string") return false;
  // Common seat formats: A12, B-08, F4, VIP-1
  const trimmed = seat.trim();
  const seatRegex = /^[A-Za-z]{1,3}-?[0-9]{1,3}$/i;
  return seatRegex.test(trimmed);
}

export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== "string") return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10;
}

export function validateCustomerName(name) {
  if (!name || typeof name !== "string") return false;
  return name.trim().length >= 2;
}
