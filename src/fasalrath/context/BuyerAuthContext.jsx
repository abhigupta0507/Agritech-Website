// src/fasalrath/context/BuyerAuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { API_BASE_URL } from "../config";

const BuyerAuthContext = createContext(null);

const TOKEN_KEY = "buyer_access_token";
const REFRESH_KEY = "buyer_refresh_token";
const USER_KEY = "buyer_data";

export const useBuyerAuth = () => {
  const ctx = useContext(BuyerAuthContext);
  if (!ctx)
    throw new Error("useBuyerAuth must be used inside BuyerAuthProvider");
  return ctx;
};

export function BuyerAuthProvider({ children }) {
  const [buyer, setBuyer] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (stored && token) {
        setBuyer(JSON.parse(stored));
        setAccessToken(token);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = (buyerData, access, refresh) => {
    localStorage.setItem(USER_KEY, JSON.stringify(buyerData));
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    setBuyer(buyerData);
    setAccessToken(access);
  };

  const clearSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setBuyer(null);
    setAccessToken(null);
  };

  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh || isRefreshing) return null;
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/buyer/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) {
        clearSession();
        return null;
      }
      const data = await res.json();
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch {
      clearSession();
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const authFetch = useCallback(
    async (url, options = {}) => {
      let token = accessToken || localStorage.getItem(TOKEN_KEY);
      const makeReq = (t) =>
        fetch(url, {
          ...options,
          headers: { ...(options.headers || {}), Authorization: `Bearer ${t}` },
        });

      let res = await makeReq(token);
      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("SESSION_EXPIRED");
        res = await makeReq(newToken);
      }
      return res;
    },
    [accessToken, refreshAccessToken],
  );

  const sendOtp = async (phone) => {
    const res = await fetch(`${API_BASE_URL}/api/buyer/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phone}` }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to send OTP");
    }
    return res.json();
  };

  const verifyOtp = async (phone, otp) => {
    const res = await fetch(`${API_BASE_URL}/api/buyer/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phone}`, otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invalid OTP");
    }
    const data = await res.json();
    const buyerData = { ...data.buyer, role: "buyer" };
    persistSession(buyerData, data.token, data.refreshToken || null);
    return data;
  };

  const logout = () => clearSession();

  const updateBuyerLocal = (partial) => {
    const updated = { ...buyer, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setBuyer(updated);
  };

  return (
    <BuyerAuthContext.Provider
      value={{
        buyer,
        accessToken,
        isLoading,
        isAuthenticated: !!buyer && !!accessToken,
        sendOtp,
        verifyOtp,
        logout,
        authFetch,
        updateBuyerLocal,
      }}
    >
      {children}
    </BuyerAuthContext.Provider>
  );
}
