// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { apiFetch } from "@/lib/apiClient";

const AuthContext = createContext(null);

const USER_KEY = "prepdart_user";
const LEGACY_TOKEN_KEY = "prepdart_auth_token"; // clean-up from old auth

function safeParseUser(raw) {
  if (!raw) return null;
  if (raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    const parsed = safeParseUser(raw);

    // If it's garbage like "undefined", remove it so it doesn't keep crashing
    if (raw && !parsed) localStorage.removeItem(USER_KEY);

    return parsed;
  });

  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((nextUser) => {
    if (!nextUser) {
      setUser(null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
      return;
    }
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.removeItem(LEGACY_TOKEN_KEY); // make sure old token is not used anywhere
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (_) {
      // ignore logout failures
    }
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }, []);

  useEffect(() => {
    setIsLoading(false);

    const handleLogout = () => logout();
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout]);

  // ✅ cookie auth => authenticated if we have a user object in memory/localStorage
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout
    }),
    [user, isAuthenticated, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
