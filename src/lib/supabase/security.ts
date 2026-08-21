/**
 * Client-side idle timeout. Independent of the Supabase session's own lifetime —
 * this only decides when an unattended browser tab signs itself out.
 */
export const ADMIN_IDLE_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
