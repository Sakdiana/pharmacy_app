const ADMIN_SESSION_KEY = "pharmacy_admin_session";
const ADMIN_PASSWORD = "admin123";

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function loginAdmin(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    window.dispatchEvent(new Event("adminChanged"));
    return true;
  }
  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event("adminChanged"));
}
