import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";

export default function GovtOtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, sendOtp } = useGovtAuth();

  const phone = location.state?.phone;
  const from = location.state?.from || "/govt/dashboard";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone) navigate("/govt/login", { replace: true });
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

  const handleVerify = useCallback(
    async (code) => {
      if (loading) return;
      setLoading(true);
      setError("");
      try {
        const data = await verifyOtp(phone, code);
        setSuccess(true);
        setTimeout(() => {
          if (!data.employee.profileComplete) {
            navigate("/govt/complete-profile", { replace: true });
          } else if (data.employee.verificationStatus !== "verified") {
            navigate("/govt/verification-pending", { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }, 800);
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
    [loading, phone, verifyOtp, navigate, from, t],
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
    <div className="govt-auth-page govt-fade-in">
      <div className="govt-auth-card govt-slide-up">
        <div className="govt-auth-card-header">
          <div className="govt-auth-logo-mark">{success ? "✅" : "🔐"}</div>
          <div className="govt-auth-title">
            {success ? t("Verified!") : t("Verify OTP")}
          </div>
          <div className="govt-auth-subtitle">
            {success
              ? t("Signing you in...")
              : t("6-digit code sent to +91 ") + phone}
          </div>
        </div>

        <div className="govt-auth-body">
          {success ? (
            <div className="govt-success-state">
              <div className="govt-success-icon">🎉</div>
              <p className="govt-success-text">
                {t("Login successful! Redirecting...")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} noValidate>
              <div className="govt-alert govt-alert-info">
                <span>💬</span>
                <span>
                  {t("OTP sent to")} <strong>+91 {phone}</strong>.{" "}
                  <Link to="/govt/login" className="govt-alert-link">
                    {t("Change number")}
                  </Link>
                </span>
              </div>

              <div className="govt-form-group govt-form-group-center">
                <label className="govt-label">{t("Verification Code")}</label>
                <div className="govt-otp-wrap" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      className={`govt-otp-input ${shake ? "error" : ""} ${digit ? "filled" : ""}`}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKey(i, e)}
                      autoFocus={i === 0}
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                    />
                  ))}
                </div>
                {error && (
                  <div className="govt-input-error govt-input-error-center">
                    <span>⚠</span> {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="govt-btn govt-btn-primary"
                disabled={loading || otp.some((d) => !d)}
              >
                {loading ? (
                  <>
                    <div className="govt-spinner" /> {t("Verifying...")}
                  </>
                ) : (
                  t("Verify & Proceed")
                )}
              </button>

              <div className="govt-resend-block">
                {cooldown > 0 ? (
                  <span className="govt-resend-text">
                    {t("Resend in")}{" "}
                    <span className="govt-countdown">{cooldown}s</span>
                  </span>
                ) : (
                  <span className="govt-resend-text">
                    {t("Didn't receive it?")}{" "}
                    <button
                      type="button"
                      className="govt-resend-btn"
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

      <div className="govt-back-link">
        <Link to="/govt/login">← {t("Back to login")}</Link>
      </div>
    </div>
  );
}
