// src/fasalrath/context/GovtAuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { API_BASE_URL } from "../config";

const GovtAuthContext = createContext(null);

const TOKEN_KEY = "govt_access_token";
const REFRESH_KEY = "govt_refresh_token";
const USER_KEY = "govt_data";

export const useGovtAuth = () => {
  const ctx = useContext(GovtAuthContext);
  if (!ctx) throw new Error("useGovtAuth must be used inside GovtAuthProvider");
  return ctx;
};

export function GovtAuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (stored && token) {
        setEmployee(JSON.parse(stored));
        setAccessToken(token);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = (employeeData, access, refresh) => {
    localStorage.setItem(USER_KEY, JSON.stringify(employeeData));
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    setEmployee(employeeData);
    setAccessToken(access);
  };

  const clearSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setEmployee(null);
    setAccessToken(null);
  };

  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh || isRefreshing) return null;
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/govt/auth/refresh`, {
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
    const res = await fetch(`${API_BASE_URL}/api/govt/auth/send-otp`, {
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
    const res = await fetch(`${API_BASE_URL}/api/govt/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+91${phone}`, otp }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Invalid OTP");
    }
    const data = await res.json();
    const employeeData = { ...data.employee, role: "govt" };
    persistSession(employeeData, data.token, data.refreshToken || null);
    return data;
  };

  const logout = () => clearSession();

  const updateEmployeeLocal = (partial) => {
    const updated = { ...employee, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setEmployee(updated);
  };

  return (
    <GovtAuthContext.Provider
      value={{
        employee,
        accessToken,
        isLoading,
        isAuthenticated: !!employee && !!accessToken,
        sendOtp,
        verifyOtp,
        logout,
        authFetch,
        updateEmployeeLocal,
      }}
    >
      {children}
    </GovtAuthContext.Provider>
  );
}
