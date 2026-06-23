"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  ADMIN_IDLE_TIMEOUT_MS,
  isDefaultLocalCredential,
  isLocalAuthAllowed,
} from "@/lib/supabase/security";

const SESSION_KEY = "oepl-admin-session";
const LAST_ACTIVITY_KEY = "oepl-admin-last-activity";
const AUTH_STORE_EVENT = "oepl-auth-change";

function notifyLocalAuthChange() {
  window.dispatchEvent(new Event(AUTH_STORE_EVENT));
}

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  useSupabase: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getExpectedCredentials() {
  return {
    username: process.env.NEXT_PUBLIC_ADMIN_USERNAME ?? "admin",
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "oepl-admin",
  };
}

function touchActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

function isIdleExpired(): boolean {
  const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!raw) return false;
  const last = Number(raw);
  if (Number.isNaN(last)) return false;
  return Date.now() - last > ADMIN_IDLE_TIMEOUT_MS;
}

const LOCAL_AUTH_LOADING_SNAPSHOT = { isAuthenticated: false, loading: true };
const LOCAL_AUTH_SIGNED_OUT_SNAPSHOT = { isAuthenticated: false, loading: false };
const LOCAL_AUTH_SIGNED_IN_SNAPSHOT = { isAuthenticated: true, loading: false };

function readLocalAuthState(): { isAuthenticated: boolean; loading: boolean } {
  if (!isLocalAuthAllowed()) {
    return LOCAL_AUTH_SIGNED_OUT_SNAPSHOT;
  }
  const hasSession = localStorage.getItem(SESSION_KEY) === "1";
  if (hasSession && isIdleExpired()) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    return LOCAL_AUTH_SIGNED_OUT_SNAPSHOT;
  }
  if (hasSession) touchActivity();
  return hasSession ? LOCAL_AUTH_SIGNED_IN_SNAPSHOT : LOCAL_AUTH_SIGNED_OUT_SNAPSHOT;
}

function subscribeLocalAuth(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(AUTH_STORE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(AUTH_STORE_EVENT, handler);
  };
}

function getLocalAuthServerSnapshot() {
  return LOCAL_AUTH_LOADING_SNAPSHOT;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const useSupabase = isSupabaseConfigured();
  const [supabaseAuthed, setSupabaseAuthed] = useState(false);
  const [supabaseLoading, setSupabaseLoading] = useState(useSupabase);

  const localAuth = useSyncExternalStore(
    subscribeLocalAuth,
    readLocalAuthState,
    getLocalAuthServerSnapshot
  );

  const isAuthenticated = useSupabase ? supabaseAuthed : localAuth.isAuthenticated;
  const loading = useSupabase ? supabaseLoading : localAuth.loading;

  const logout = useCallback(async () => {
    if (useSupabase) {
      const supabase = createClient();
      await supabase.auth.signOut();
      setSupabaseAuthed(false);
    } else {
      localStorage.removeItem(SESSION_KEY);
      notifyLocalAuthChange();
    }
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }, [useSupabase]);

  useEffect(() => {
    if (!useSupabase) return;

    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isIdleExpired()) {
        void supabase.auth.signOut().then(() => setSupabaseAuthed(false));
      } else {
        setSupabaseAuthed(!!session);
        if (session) touchActivity();
      }
      setSupabaseLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseAuthed(!!session);
      if (session) touchActivity();
    });

    return () => subscription.unsubscribe();
  }, [useSupabase]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let timer: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      touchActivity();
      clearTimeout(timer);
      timer = setTimeout(() => {
        void logout();
      }, ADMIN_IDLE_TIMEOUT_MS);
    };

    const onActivity = () => resetIdleTimer();
    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));
    resetIdleTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, onActivity));
    };
  }, [isAuthenticated, logout]);

  const login = useCallback(
    async (emailOrUsername: string, password: string) => {
      if (useSupabase) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername.trim(),
          password,
        });
        if (error) return false;
        touchActivity();
        setSupabaseAuthed(true);
        return true;
      }

      if (!isLocalAuthAllowed()) return false;

      const expected = getExpectedCredentials();
      const username = emailOrUsername.trim();
      if (
        process.env.NODE_ENV === "production" &&
        isDefaultLocalCredential(username, password) &&
        !process.env.NEXT_PUBLIC_ADMIN_USERNAME
      ) {
        return false;
      }
      if (username === expected.username && password === expected.password) {
        localStorage.setItem(SESSION_KEY, "1");
        touchActivity();
        notifyLocalAuthChange();
        return true;
      }
      return false;
    },
    [useSupabase]
  );

  const value = useMemo(
    () => ({ isAuthenticated, loading, useSupabase, login, logout }),
    [isAuthenticated, loading, useSupabase, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
