/**
 * Unique ID and Idempotency key generator for theater food orders
 */

export function generateOrderId() {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomSuffix}`;
}

export function generateIdempotencyKey(seat, timestamp = Date.now()) {
  const sanitizedSeat = (seat || "SEAT").replace(/\s+/g, "").toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `IDEMP-${sanitizedSeat}-${timestamp}-${randomStr}`;
}
