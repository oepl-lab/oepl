/** Client idle timeout — complements admin session cookie maxAge */
export const ADMIN_IDLE_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

/** Legacy localStorage admin fallback — development only, when Supabase is not configured */
export function isLocalAuthAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function isDefaultLocalCredential(username: string, password: string): boolean {
  return username === "admin" && password === "oepl-admin";
}
