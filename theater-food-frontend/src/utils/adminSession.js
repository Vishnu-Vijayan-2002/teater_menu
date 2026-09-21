const ADMIN_SESSION_KEY = "cinema_admin_session";

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse admin session:", error);
    return null;
  }
}

export function saveAdminSession(adminData) {
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
  } catch (error) {
    console.error("Failed to store admin session:", error);
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear admin session:", error);
  }
}
