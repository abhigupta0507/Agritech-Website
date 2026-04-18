// src/fasalrath/pages/govt/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";

export default function GovtLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sendOtp } = useGovtAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/fasalrath/govt/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    setError("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError(t("Please enter a valid 10-digit mobile number"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOtp(phone);
      navigate("/fasalrath/govt/otp", { state: { phone, from } });
    } catch (err) {
      setError(err.message || t("Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up">
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark" style={{ background: "#606C38" }}>
            🏛️
          </div>
          <div className="fr-auth-title">{t("Government Portal")}</div>
          <div className="fr-auth-subtitle">
            {t("Authorized Personnel Only")}
          </div>
        </div>

        <div className="fr-auth-body">
          <form onSubmit={handleSend} noValidate>
            <div className="fr-form-group">
              <label className="fr-label" htmlFor="phone">
                {t("Mobile Number")}
              </label>
              <div className={`fr-phone-wrap ${error ? "error" : ""}`}>
                <div className="fr-phone-prefix">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  className="fr-phone-input"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={handlePhoneChange}
                  autoFocus
                  autoComplete="tel"
                />
              </div>
              {error && (
                <div className="fr-input-error">
                  <span>⚠</span> {error}
                </div>
              )}
              <div className="fr-input-hint">
                {t("We'll send a 6-digit OTP to this number")}
              </div>
            </div>

            <button
              type="submit"
              className="fr-btn fr-btn-primary"
              disabled={loading || phone.length !== 10}
              style={{ background: "#606C38" }}
            >
              {loading ? (
                <>
                  <div className="fr-spinner" /> {t("Sending OTP...")}
                </>
              ) : (
                t("Continue")
              )}
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link
          to="/fasalrath"
          style={{
            fontSize: 13,
            color: "var(--fr-text-light)",
            textDecoration: "none",
          }}
        >
          ← {t("Back to role selection")}
        </Link>
      </div>
    </div>
  );
}
