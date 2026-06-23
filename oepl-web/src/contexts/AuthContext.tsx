"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const SESSION_KEY = "oepl-admin-session";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const useSupabase = isSupabaseConfigured();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useSupabase) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });

      return () => subscription.unsubscribe();
    }

    setIsAuthenticated(localStorage.getItem(SESSION_KEY) === "1");
    setLoading(false);
  }, [useSupabase]);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    if (useSupabase) {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername.trim(),
        password,
      });
      if (error) return false;
      setIsAuthenticated(true);
      return true;
    }

    const expected = getExpectedCredentials();
    if (emailOrUsername === expected.username && password === expected.password) {
      localStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [useSupabase]);

  const logout = useCallback(async () => {
    if (useSupabase) {
      const supabase = createClient();
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsAuthenticated(false);
  }, [useSupabase]);

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
