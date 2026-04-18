// src/fasalrath/context/VendorAuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { API_BASE_URL } from "../config";

const VendorAuthContext = createContext(null);

const TOKEN_KEY = "vendor_access_token";
const REFRESH_KEY = "vendor_refresh_token";
const USER_KEY = "vendor_data";

export const useVendorAuth = () => {
  const ctx = useContext(VendorAuthContext);
  if (!ctx)
    throw new Error("useVendorAuth must be used inside VendorAuthProvider");
  return ctx;
};

export function VendorAuthProvider({ children }) {
  const [vendor, setVendor] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (stored && token) {
        setVendor(JSON.parse(stored));
        setAccessToken(token);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = (vendorData, access, refresh) => {
    localStorage.setItem(USER_KEY, JSON.stringify(vendorData));
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    setVendor(vendorData);
    setAccessToken(access);
  };

  const clearSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setVendor(null);
    setAccessToken(null);
  };

  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh || isRefreshing) return null;
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendor/auth/refresh`, {
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
    const res = await fetch(`${API_BASE_URL}/api/vendor/auth/send-otp`, {
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
    const cleanPhone = phone.startsWith("+91") ? phone.slice(3) : phone;

    const res = await fetch(`${API_BASE_URL}/api/vendor/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${cleanPhone}`, otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invalid OTP");
    }
    const data = await res.json();
    const vendorData = { ...data.vendor, role: "vendor" };
    persistSession(vendorData, data.token, data.refreshToken || null);
    return data;
  };

  const logout = () => clearSession();

  const updateVendorLocal = (partial) => {
    const updated = { ...vendor, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setVendor(updated);
  };

  return (
    <VendorAuthContext.Provider
      value={{
        vendor,
        accessToken,
        isLoading,
        isAuthenticated: !!vendor && !!accessToken,
        sendOtp,
        verifyOtp,
        logout,
        authFetch,
        updateVendorLocal,
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
}
