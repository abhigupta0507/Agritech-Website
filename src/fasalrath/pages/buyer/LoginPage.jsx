// src/fasalrath/pages/buyer/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

export default function BuyerLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, sendOtp } = useBuyerAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/fasalrath/buyer/profile";

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
      const checkRes = await fetch(`${API_BASE_URL}/api/buyer/auth/buyer-exist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      const checkData = await checkRes.json();
      //console.log(checkData);

      if (checkRes.status === 404 || checkData.exists === false) {
        //("HEERE");
        navigate("/fasalrath/buyer/register", { state: { phone: `+91${phone}` } });
      } else if (checkRes.ok && checkData.exists === true) {
        await sendOtp(phone);
        navigate("/fasalrath/buyer/otp", { state: { phone, from } });
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
          <div className="fr-auth-logo-mark" style={{ background: "#E76F51" }}>💼</div>
          <div className="fr-auth-title">{t("Buyer Login")}</div>
          <div className="fr-auth-subtitle">{t("Access post-harvest marketplace")}</div>
        </div>

        <div className="fr-auth-body">
          <form onSubmit={handleSend} noValidate>
            <div className="fr-form-group">
              <label className="fr-label" htmlFor="phone">{t("Mobile Number")}</label>
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
              {error && <div className="fr-input-error"><span>⚠</span> {error}</div>}
              <div className="fr-input-hint">{t("We'll send a 6-digit OTP to this number")}</div>
            </div>

            <button type="submit" className="fr-btn fr-btn-primary" disabled={loading || phone.length !== 10}
              style={{ background: "#E76F51" }}>
              {loading ? <><div className="fr-spinner" /> {t("Sending OTP...")}</> : t("Continue")}
            </button>
          </form>

          <div className="fr-auth-divider" style={{ margin: "20px 0" }}>
            <div className="fr-auth-divider-line" />
            <span className="fr-auth-divider-text">{t("New to FasalRath?")}</span>
            <div className="fr-auth-divider-line" />
          </div>

          <p style={{ fontSize: 13, color: "var(--fr-text-light)", textAlign: "center", lineHeight: 1.6 }}>
            {t("If you don't have an account, you'll be registered automatically after OTP verification.")}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link to="/fasalrath" style={{ fontSize: 13, color: "var(--fr-text-light)", textDecoration: "none" }}>
          ← {t("Back to role selection")}
        </Link>
      </div>
    </div>
  );
}