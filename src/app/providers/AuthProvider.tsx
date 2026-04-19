"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthContextValue, AuthUser } from "@/lib/auth/types";
import {
  getCurrentUser,
  loginWithEmail,
  loginWithGoogle as loginWithGoogleService,
  logoutCurrentUser,
  registerWithEmail,
} from "@/lib/auth/auth-service";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const current = await getCurrentUser();
      setUser(current);
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const register = useCallback<AuthContextValue["register"]>(async (payload) => {
    setIsLoading(true);
    try {
      const nextUser = await registerWithEmail(payload);
      setUser(nextUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback<AuthContextValue["login"]>(async (email, password) => {
    setIsLoading(true);
    try {
      const nextUser = await loginWithEmail(email, password);
      setUser(nextUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    loginWithGoogleService();
  }, []);

  const logout = useCallback<AuthContextValue["logout"]>(async () => {
    setIsLoading(true);
    try {
      await logoutCurrentUser();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isReady,
      login,
      loginWithGoogle,
      register,
      logout,
      refresh,
    }),
    [user, isLoading, isReady, login, loginWithGoogle, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
