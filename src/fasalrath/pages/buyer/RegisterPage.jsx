// src/fasalrath/pages/buyer/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../config";

export default function BuyerRegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim())
      errs.companyName = t("Company name is required");
    if (!form.contactPerson.trim())
      errs.contactPerson = t("Contact person is required");
    if (!form.email.trim()) errs.email = t("Email is required");
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email))
        errs.email = t("Please enter a valid email address");
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
      const res = await fetch(`${API_BASE_URL}/api/buyer/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        const pendingProfile = JSON.stringify(form);
        await localStorage.setItem("pending_buyer_profile", JSON.stringify(form));
        navigate("/fasalrath/buyer/otp", {
          state: { phone, pendingProfile },
        });
      } else {
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
          <div className="fr-auth-logo-mark" style={{ background: "#E76F51" }}>
            💼
          </div>
          <div className="fr-auth-title">{t("Buyer Registration")}</div>
          <div className="fr-auth-subtitle">
            {t("Complete your company details")}
          </div>
        </div>

        <div className="fr-auth-body">
          <div className="fr-alert fr-alert-info">
            <span>ℹ️</span>
            <span>
              {t("Registering for")}: <strong>{phone}</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="fr-form-group">
              <label className="fr-label">{t("Company Name")} *</label>
              <input
                className={`fr-input ${errors.companyName ? "error" : ""}`}
                value={form.companyName}
                onChange={set("companyName")}
                placeholder={t("e.g. Fresh Foods Inc.")}
              />
              {errors.companyName && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.companyName}
                </div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Contact Person Name")} *</label>
              <input
                className={`fr-input ${errors.contactPerson ? "error" : ""}`}
                value={form.contactPerson}
                onChange={set("contactPerson")}
                placeholder={t("e.g. Rohan Gupta")}
              />
              {errors.contactPerson && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.contactPerson}
                </div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Business Email")} *</label>
              <input
                className={`fr-input ${errors.email ? "error" : ""}`}
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder={t("e.g. procurement@freshfoods.com")}
                autoCapitalize="none"
              />
              {errors.email && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="fr-btn fr-btn-teal"
              disabled={loading}
              style={{ background: "#E76F51" }}
            >
              {loading ? (
                <>
                  <div className="fr-spinner" /> {t("Sending OTP...")}
                </>
              ) : (
                t("Send OTP & Verify")
              )}
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
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
