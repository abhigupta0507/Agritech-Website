import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../context/FarmerAuthContext";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bho", label: "भोजपुरी" },
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sendOtp } = useFarmerAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const from = location.state?.from?.pathname || "/fasalrath/dashboard";

  // Already logged in → redirect
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
      navigate("/fasalrath/otp", { state: { phone, from } });
    } catch (err) {
      setError(err.message || t("Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      {/* Language picker */}
      <div className="fr-lang-bar">
        {LANGS.map(l => (
          <button
            key={l.code}
            className={`fr-lang-pill ${i18n.language === l.code ? "active" : ""}`}
            onClick={() => i18n.changeLanguage(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="fr-auth-card fr-slide-up">
        {/* Header */}
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark">🌾</div>
          <div className="fr-auth-title">{t("Sign in to FasalRath")}</div>
          <div className="fr-auth-subtitle">{t("Your complete farming companion")}</div>
        </div>

        {/* Body */}
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
            >
              {loading ? (
                <><div className="fr-spinner" /> {t("Sending OTP...")}</>
              ) : (
                t("Continue")
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="fr-auth-divider" style={{ margin: "20px 0" }}>
            <div className="fr-auth-divider-line" />
            <span className="fr-auth-divider-text">{t("New to FasalRath?")}</span>
            <div className="fr-auth-divider-line" />
          </div>

          <p style={{ fontSize: 13, color: "var(--fr-text-light)", textAlign: "center", lineHeight: 1.6 }}>
            {t("If you don't have an account, you'll be registered automatically after OTP verification.")}
          </p>

          {/* Trust badges */}
          <div className="fr-auth-trust" style={{ marginTop: 20 }}>
            {[
              { icon: "🔒", text: t("Secure Login") },
              { icon: "🇮🇳", text: t("Made for Bharat") },
              { icon: "🌐", text: t("3 Languages") },
            ].map(b => (
              <div key={b.text} className="fr-trust-badge">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back to main site */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link
          to="/"
          style={{ fontSize: 13, color: "var(--fr-text-light)", textDecoration: "none" }}
        >
          ← {t("Back to AgriTech homepage")}
        </Link>
      </div>

      {/* Conditions */}
      <p style={{
        maxWidth: 380,
        textAlign: "center",
        fontSize: 11,
        color: "var(--fr-text-xlight)",
        marginTop: 16,
        lineHeight: 1.6,
      }}>
        {t("By continuing, you agree to AgriTech's")}
        {" "}
        <Link to="/privacy" style={{ color: "var(--fr-teal)", textDecoration: "underline" }}>
          {t("Privacy Policy")}
        </Link>
      </p>
    </div>
  );
}
