import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bho", label: "भोजपुरी" },
];

export default function GovtLoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sendOtp } = useGovtAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/govt/dashboard";

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
      navigate("/govt/otp", { state: { phone, from } });
    } catch (err) {
      setError(err.message || t("Failed to send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="govt-auth-page govt-fade-in">
      <div className="govt-lang-bar">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={`govt-lang-pill ${i18n.language === l.code ? "active" : ""}`}
            onClick={() => i18n.changeLanguage(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="govt-auth-card govt-slide-up">
        <div className="govt-auth-card-header">
          <div className="govt-auth-logo-mark">🏛️</div>
          <div className="govt-auth-title">{t("Government Portal")}</div>
          <div className="govt-auth-subtitle">
            {t("Authorized Personnel Only")}
          </div>
        </div>

        <div className="govt-auth-body">
          <div className="govt-alert govt-alert-warning">
            <span>⚠️</span>
            <span>
              {t("This portal is restricted to government officials only")}
            </span>
          </div>

          <form onSubmit={handleSend} noValidate>
            <div className="govt-form-group">
              <label className="govt-label" htmlFor="phone">
                {t("Mobile Number")}
              </label>
              <div className={`govt-phone-wrap ${error ? "error" : ""}`}>
                <div className="govt-phone-prefix">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  className="govt-phone-input"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={handlePhoneChange}
                  autoFocus
                  autoComplete="tel"
                />
              </div>
              {error && (
                <div className="govt-input-error">
                  <span>⚠</span> {error}
                </div>
              )}
              <div className="govt-input-hint">
                {t("Use your registered government mobile number")}
              </div>
            </div>

            <button
              type="submit"
              className="govt-btn govt-btn-primary"
              disabled={loading || phone.length !== 10}
            >
              {loading ? (
                <>
                  <div className="govt-spinner" /> {t("Sending OTP...")}
                </>
              ) : (
                t("Send OTP")
              )}
            </button>
          </form>

          <div className="govt-auth-trust">
            {[
              { icon: "🔒", text: t("Secure Access") },
              { icon: "🏛️", text: t("Govt. Only") },
              { icon: "🛡️", text: t("Verified") },
            ].map((b) => (
              <div key={b.text} className="govt-trust-badge">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="govt-back-link">
        <Link to="/">← {t("Back to Main Portal")}</Link>
      </div>
    </div>
  );
}
