// src/fasalrath/pages/vendor/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../config";

export default function VendorRegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.businessName.trim())
      errs.businessName = t("Business name is required");
    if (!form.ownerName.trim()) errs.ownerName = t("Owner name is required");
    if (!form.email.trim()) {
      errs.email = t("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t("Invalid email format");
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vendor/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        // Save to vendor-specific key
        await localStorage.setItem(
          "pending_vendor_profile",
          JSON.stringify(form),
        );
        navigate("/fasalrath/vendor/otp", { state: { phone } });
      } else {
        const data = await res.json();
        alert(data.message || t("Registration failed"));
      }
    } catch (err) {
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up" style={{ maxWidth: 480 }}>
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark" style={{ background: "#2A9D8F" }}>
            🚚
          </div>
          <div className="fr-auth-title">{t("Vendor Registration")}</div>
        </div>

        <div className="fr-auth-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="fr-form-group">
              <label className="fr-label">{t("Business Name")}</label>
              <input
                className={`fr-input ${errors.businessName ? "error" : ""}`}
                value={form.businessName}
                onChange={set("businessName")}
              />
              {errors.businessName && (
                <div className="fr-input-error">{errors.businessName}</div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Owner Name")}</label>
              <input
                className={`fr-input ${errors.ownerName ? "error" : ""}`}
                value={form.ownerName}
                onChange={set("ownerName")}
              />
              {errors.ownerName && (
                <div className="fr-input-error">{errors.ownerName}</div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Email")}</label>
              <input
                className={`fr-input ${errors.email ? "error" : ""}`}
                type="email"
                value={form.email}
                onChange={set("email")}
              />
              {errors.email && (
                <div className="fr-input-error">{errors.email}</div>
              )}
            </div>

            <button
              type="submit"
              className="fr-btn"
              disabled={loading}
              style={{ background: "#2A9D8F" }}
            >
              {loading ? t("Sending OTP...") : t("Verify & Register")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
