// src/fasalrath/pages/vendor/OtpPage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorOtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, sendOtp } = useVendorAuth();

  const phone = location.state?.phone;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone) navigate("/fasalrath/vendor/login", { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    if (otp.every((d) => d !== "")) handleVerify(otp.join(""));
  }, [otp]);

  const handleVerify = useCallback(
    async (code) => {
      if (loading) return;
      setLoading(true);
      setError("");

      try {
        //console.log(phone);
        const authData = await verifyOtp(phone, code);
        const token = authData?.token;

        // Retrieve pending vendor profile
        const savedProfile = await localStorage.getItem(
          "pending_vendor_profile",
        );

        if (savedProfile && token) {
          const profileData = JSON.parse(savedProfile);

          // API call to update vendor profile
          const updateRes = await fetch(
            `${API_BASE_URL}/api/vendor/auth/update-profile`,
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
            localStorage.removeItem("pending_vendor_profile");
          }
        }

        setSuccess(true);
        setTimeout(() => {
          navigate("/fasalrath/vendor/dashboard", { replace: true });
        }, 1500);
      } catch (err) {
        setError(err.message || t("Invalid OTP"));
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [phone, verifyOtp, navigate, t],
  );

  // Standard input handlers (handleChange, handleKey, handlePaste) would go here, identical to BuyerOtpPage logic.

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up">
        <div className="fr-auth-card-header">
          <div
            className="fr-auth-logo-mark"
            style={{ background: success ? "#2A9D8F" : "#2A9D8F" }}
          >
            {success ? "✅" : "📱"}
          </div>
          <div className="fr-auth-title">
            {success ? t("Verified!") : t("Vendor Verification")}
          </div>
        </div>

        <div className="fr-auth-body">
          {!success ? (
            <div className="fr-form-group">
              <label className="fr-label">
                {t("Enter OTP sent to")} +91 {phone}
              </label>
              <div className="fr-otp-wrap">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    className="fr-otp-input"
                    onChange={(e) => {
                      const next = [...otp];
                      next[i] = e.target.value.slice(-1);
                      setOtp(next);
                      if (e.target.value && i < 5)
                        inputRefs.current[i + 1].focus();
                    }}
                  />
                ))}
              </div>
              {error && (
                <div className="fr-input-error" style={{ textAlign: "center" }}>
                  {error}
                </div>
              )}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "var(--fr-success)" }}>
              {t("Redirecting to dashboard...")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
