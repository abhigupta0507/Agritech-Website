import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
// API_BASE_URL=process.env.API_BASE_URL;

const FarmerAuthContext = createContext(null);

const TOKEN_KEY = "fr_access_token";
const REFRESH_KEY = "fr_refresh_token";
const USER_KEY = "fr_farmer_data";

export const useFarmerAuth = () => {
  const ctx = useContext(FarmerAuthContext);
  if (!ctx) throw new Error("useFarmerAuth must be used inside FarmerAuthProvider");
  return ctx;
};

export function FarmerAuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ── Boot: load persisted session ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (stored && token) {
        setFarmer(JSON.parse(stored));
        setAccessToken(token);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── Persist helper ── */
  const persistSession = (farmerData, access, refresh) => {
    localStorage.setItem(USER_KEY, JSON.stringify(farmerData));
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    setFarmer(farmerData);
    setAccessToken(access);
  };

  const clearSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setFarmer(null);
    setAccessToken(null);
  };

  /* ── Refresh token ── */
  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh || isRefreshing) return null;
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/farmer-auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) { clearSession(); return null; }
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

  /* ── Authenticated fetch (auto-refresh on 401) ── */
  const authFetch = useCallback(async (url, options = {}) => {
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
  }, [accessToken, refreshAccessToken]);

  /* ── Send OTP ── */
  const sendOtp = async (phone) => {
    //(API_BASE_URL);
    const res = await fetch(`${API_BASE_URL}/api/farmer-auth/send-otp`, {
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

  /* ── Verify OTP → sets session ── */
  const verifyOtp = async (phone, otp) => {
    const res = await fetch(`${API_BASE_URL}/api/farmer-auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phone}`, otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invalid OTP");
    }
    const data = await res.json();
    const farmerData = { ...data.farmer, role: "farmer" };
    // Use refreshToken from response if backend provides it
    persistSession(farmerData, data.token, data.refreshToken || null);
    return data;
  };

  /* ── Logout ── */
  const logout = () => clearSession();

  /* ── Update farmer profile locally ── */
  const updateFarmerLocal = (partial) => {
    const updated = { ...farmer, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setFarmer(updated);
  };

  return (
    <FarmerAuthContext.Provider value={{
      farmer,
      accessToken,
      isLoading,
      isAuthenticated: !!farmer && !!accessToken,
      sendOtp,
      verifyOtp,
      logout,
      authFetch,
      updateFarmerLocal,
    }}>
      {children}
    </FarmerAuthContext.Provider>
  );
}
