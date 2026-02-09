// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'prepdart_auth_token';
const USER_KEY = 'prepdart_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (_) {
      // ignore logout failures
    }
    setUser(null);
    localStorage.removeItem("prepdart_user");
  };
  
  useEffect(() => {
    const saved = localStorage.getItem("prepdart_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);
  

  useEffect(() => {
    // Check if token exists on mount
    setIsLoading(false);

    // Listen for logout events from apiClient (e.g., on 401 errors)
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [logout]);

  const login = (user) => {
    setUser(user);
    localStorage.setItem("prepdart_user", JSON.stringify(user));
  };
  

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
