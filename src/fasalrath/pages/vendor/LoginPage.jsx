// src/fasalrath/pages/vendor/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sendOtp } = useVendorAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/fasalrath/vendor/profile";

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
      const checkRes = await fetch(
        `${API_BASE_URL}/api/vendor/auth/vendor-exist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+91${phone}` }),
        },
      );

      const checkData = await checkRes.json();

      if (checkRes.status === 404 || checkData.exists === false) {
        // Navigate to Register if vendor doesn't exist
        navigate("/fasalrath/vendor/register", {
          state: { phone: `+91${phone}` },
        });
      } else if (checkRes.ok && checkData.exists === true) {
        await sendOtp(phone);
        navigate("/fasalrath/vendor/otp", { state: { phone, from } });
      } else {
        setError(checkData.message || t("Something went wrong"));
      }
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
          <div className="fr-auth-logo-mark" style={{ background: "#2A9D8F" }}>
            🚚
          </div>
          <div className="fr-auth-title">{t("Vendor Login")}</div>
          <div className="fr-auth-subtitle">
            {t("Logistics & Fleet Management")}
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
                />
              </div>
              {error && (
                <div className="fr-input-error">
                  <span>⚠</span> {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="fr-btn fr-btn-primary"
              disabled={loading || phone.length !== 10}
              style={{ background: "#2A9D8F" }}
            >
              {loading ? t("Sending OTP...") : t("Continue")}
            </button>
          </form>

          <div className="fr-auth-divider" style={{ margin: "20px 0" }}>
            <div className="fr-auth-divider-line" />
            <span className="fr-auth-divider-text">{t("New Vendor?")}</span>
            <div className="fr-auth-divider-line" />
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--fr-text-light)",
              textAlign: "center",
            }}
          >
            {t("Register to start managing your fleet.")}
          </p>
        </div>
      </div>
    </div>
  );
}
