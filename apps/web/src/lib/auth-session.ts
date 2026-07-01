export const AUTH_COOKIE_NAME = "vts_auth_session";
export const ROLE_COOKIE_NAME = "vts_user_role";
export const ACCESS_MODE_COOKIE_NAME = "vts_access_mode";

export type VtsRole = "admin" | "cliente";

export function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function setRoleCookie(role: VtsRole) {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE_NAME}=${role}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function setDemoAccess(role: VtsRole) {
  if (typeof document === "undefined") return;
  setAuthCookie();
  setRoleCookie(role);
  document.cookie = `${ACCESS_MODE_COOKIE_NAME}=demo; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function getRoleFromDocument(): VtsRole | null {
  if (typeof document === "undefined") return null;

  const roleEntry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ROLE_COOKIE_NAME}=`));

  if (!roleEntry) return null;
  const value = roleEntry.split("=")[1];
  if (value === "admin" || value === "cliente") return value;
  return null;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function clearDemoAccess() {
  if (typeof document === "undefined") return;
  clearAuthCookie();
  document.cookie = `${ROLE_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ACCESS_MODE_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
