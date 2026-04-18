// src/fasalrath/pages/buyer/OtpPage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";
export default function BuyerOtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, sendOtp } = useBuyerAuth();

  const phone = location.state?.phone;
  const from = location.state?.from || "/fasalrath/buyer/profile";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone) navigate("/fasalrath/buyer/login", { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (otp.every((d) => d !== "")) {
      handleVerify(otp.join(""));
    }
  }, [otp]);

  const focusNext = (i) => {
    if (i < 5) inputRefs.current[i + 1]?.focus();
  };

  const focusPrev = (i) => {
    if (i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const next = [...otp];
        next[i] = "";
        setOtp(next);
      } else {
        focusPrev(i);
      }
    } else if (e.key === "ArrowLeft") focusPrev(i);
    else if (e.key === "ArrowRight") focusNext(i);
  };

  const handleChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    setError("");
    if (digit) focusNext(i);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = [...otp];
    text.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    const lastIdx = Math.min(text.length - 1, 5);
    inputRefs.current[lastIdx]?.focus();
  };

  // Inside OtpPage.jsx -> handleVerify
  const handleVerify = useCallback(
    async (code) => {
      if (loading) return;
      setLoading(true);
      setError("");

      try {
        // 1. Verify OTP and get the auth session/token
        const authData = await verifyOtp(phone, code);
        const token = authData?.token; // Adjust based on what verifyOtp returns

        // 2. Retrieve pending profile from localStorage
        const savedProfile = await localStorage.getItem("pending_buyer_profile");
        //console.log(savedProfile,token);
        if (savedProfile && token) {
          const profileData = JSON.parse(savedProfile);
          //console.log(profileData);

          // 3. Make the secondary API call to update profile
          const updateRes = await fetch(
            `${API_BASE_URL}/api/buyer/auth/update-profile`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(profileData),
            },
          );

          if (updateRes.ok) {
            // Success: Clear the storage
            localStorage.removeItem("pending_buyer_profile");
          } else {
            console.error("Profile update failed, but login was successful.");
          }
        }

        setSuccess(true);
        // Redirect to profile or dashboard
        setTimeout(() => {
          navigate("/fasalrath/buyer/profile", { replace: true });
        }, 1500);
      } catch (err) {
        setError(err.message || t("Invalid OTP. Please try again."));
        setShake(true);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          setShake(false);
          inputRefs.current[0]?.focus();
        }, 400);
      } finally {
        setLoading(false);
      }
    },
    [loading, phone, verifyOtp, navigate, t],
  );

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await sendOtp(phone);
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || t("Failed to resend OTP"));
    } finally {
      setResending(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError(t("Please enter the complete 6-digit OTP"));
      return;
    }
    handleVerify(code);
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up">
        <div className="fr-auth-card-header">
          <div
            className="fr-auth-logo-mark"
            style={{ background: success ? "#2A9D8F" : "#E76F51" }}
          >
            {success ? "✅" : "📱"}
          </div>
          <div className="fr-auth-title">
            {success ? t("Verified!") : t("Enter OTP")}
          </div>
          <div className="fr-auth-subtitle">
            {success
              ? t("Signing you in...")
              : t("6-digit code sent to +91 ") + phone}
          </div>
        </div>

        <div className="fr-auth-body">
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48 }}>🎉</div>
              <p
                style={{
                  color: "var(--fr-success)",
                  fontWeight: 600,
                  marginTop: 12,
                }}
              >
                {t("Login successful! Redirecting...")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} noValidate>
              <div
                className="fr-alert fr-alert-info"
                style={{ marginBottom: 20 }}
              >
                <span>💬</span>
                <span>
                  {t("OTP sent to")} <strong>+91 {phone}</strong>.{" "}
                  <Link
                    to="/fasalrath/buyer/login"
                    style={{
                      color: "var(--fr-teal-dark)",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    {t("Change number")}
                  </Link>
                </span>
              </div>

              <div className="fr-form-group" style={{ textAlign: "center" }}>
                <label className="fr-label" style={{ marginBottom: 14 }}>
                  {t("Verification Code")}
                </label>
                <div className="fr-otp-wrap" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      className={`fr-otp-input ${shake ? "error" : ""} ${digit ? "filled" : ""}`}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKey(i, e)}
                      autoFocus={i === 0}
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                    />
                  ))}
                </div>
                {error && (
                  <div
                    className="fr-input-error"
                    style={{ justifyContent: "center", marginTop: 10 }}
                  >
                    <span>⚠</span> {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="fr-btn fr-btn-teal"
                disabled={loading || otp.some((d) => !d)}
                style={{ marginBottom: 8, background: "#E76F51" }}
              >
                {loading ? (
                  <>
                    <div className="fr-spinner" /> {t("Verifying...")}
                  </>
                ) : (
                  t("Verify & Sign In")
                )}
              </button>

              <div className="fr-resend-block">
                {cooldown > 0 ? (
                  <span className="fr-resend-text">
                    {t("Resend in")}{" "}
                    <span className="fr-countdown">{cooldown}s</span>
                  </span>
                ) : (
                  <span className="fr-resend-text">
                    {t("Didn't receive it?")}{" "}
                    <button
                      type="button"
                      className="fr-resend-btn"
                      onClick={handleResend}
                      disabled={resending}
                    >
                      {resending ? t("Sending...") : t("Resend OTP")}
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link
          to="/fasalrath/buyer/login"
          style={{
            fontSize: 13,
            color: "var(--fr-text-light)",
            textDecoration: "none",
          }}
        >
          ← {t("Back to login")}
        </Link>
      </div>
    </div>
  );
}