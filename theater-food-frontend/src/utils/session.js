const SESSION_STORAGE_KEY = "cinema_customer_session";

export function getCustomerSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse customer session:", error);
    return null;
  }
}

export function saveCustomerSession(sessionData) {
  try {
    const existing = getCustomerSession() || {};
    const updated = {
      ...existing,
      ...sessionData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Failed to save customer session:", error);
    return null;
  }
}

export function clearCustomerSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear customer session:", error);
  }
}
