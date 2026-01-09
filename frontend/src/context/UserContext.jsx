import { createContext, useMemo, useState } from "react";
import api from "../services/api";

export const UserContext = createContext(null);

const LS_USER_KEY = "user";

export function UserProvider({ children }) {
  // ✅ hydrate from localStorage WITHOUT useEffect
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // ✅ no need for an effect; we are ready immediately
  const authLoading = false;

  const saveAuth = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(nextUser));
  };

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem(LS_USER_KEY);
  };

  // --------------------------------------------------
  // AUTH METHODS (cookie-based)
  // --------------------------------------------------
  const login = async ({ email, password }) => {
    const res = await api.post("/auth/user/login", { email, password });
    // backend returns { user } and sets httpOnly cookie token
    saveAuth(res.data.user);
    return res.data;
  };

  const signup = async ({ name, email, password }) => {
    const res = await api.post("/auth/user/signup", { name, email, password });
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/user/logout");
    clearAuth();
  };

  const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  };

  const resetPassword = async ({ token, password }) => {
    const res = await api.post("/auth/reset-password", { token, password });
    return res.data;
  };

  const isLoggedIn = !!user;

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      authLoading,

      login,
      signup,
      logout,

      forgotPassword,
      resetPassword,

      setUser,
    }),
    [user, isLoggedIn]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
