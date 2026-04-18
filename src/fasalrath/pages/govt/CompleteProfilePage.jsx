// src/fasalrath/pages/govt/CompleteProfilePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function GovtCompleteProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employee, authFetch, updateEmployeeLocal } = useGovtAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    homeAddress: "",
    maritalStatus: "single",
    accountNumber: "",
    IFSCCode: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Name is required");
    if (form.email && form.email.trim()) {
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
      const res = await authFetch(
        `${API_BASE_URL}/api/govt/auth/complete-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || t("Failed to complete profile"));
      }

      const data = await res.json();
      updateEmployeeLocal({
        ...data.employee,
        profileComplete: true,
        verificationStatus: "pending",
      });
      navigate("/fasalrath/govt/verification-pending", { replace: true });
    } catch (err) {
      alert(err.message || t("Failed to complete profile"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up" style={{ maxWidth: 600 }}>
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark" style={{ background: "#606C38" }}>
            📋
          </div>
          <div className="fr-auth-title">{t("Complete Your Profile")}</div>
          <div className="fr-auth-subtitle">
            {t("Please provide your details")}
          </div>
        </div>

        <div className="fr-auth-body">
          <div className="fr-alert fr-alert-info">
            <span>ℹ️</span>
            <span>
              {t("Your profile will be reviewed by an administrator")}
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="fr-form-group">
              <label className="fr-label">{t("Full Name")} *</label>
              <input
                className={`fr-input ${errors.name ? "error" : ""}`}
                value={form.name}
                onChange={set("name")}
                placeholder={t("Enter your full name")}
              />
              {errors.name && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.name}
                </div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Email Address")}</label>
              <input
                className={`fr-input ${errors.email ? "error" : ""}`}
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder={t("Enter your email")}
                autoCapitalize="none"
              />
              {errors.email && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.email}
                </div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Home Address")}</label>
              <textarea
                className="fr-input"
                value={form.homeAddress}
                onChange={set("homeAddress")}
                placeholder={t("Enter your address")}
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Marital Status")}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {["single", "married", "divorced", "widowed"].map((status) => (
                  <label
                    key={status}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="maritalStatus"
                      value={status}
                      checked={form.maritalStatus === status}
                      onChange={() =>
                        setForm((f) => ({ ...f, maritalStatus: status }))
                      }
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14 }}>
                      {t(status.charAt(0).toUpperCase() + status.slice(1))}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Account Number")}</label>
              <input
                className="fr-input"
                value={form.accountNumber}
                onChange={set("accountNumber")}
                placeholder={t("Enter account number")}
                inputMode="numeric"
              />
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("IFSC Code")}</label>
              <input
                className="fr-input"
                value={form.IFSCCode}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    IFSCCode: e.target.value.toUpperCase(),
                  }))
                }
                placeholder={t("Enter IFSC code")}
              />
            </div>

            <button
              type="submit"
              className="fr-btn fr-btn-teal"
              disabled={loading}
              style={{ background: "#606C38" }}
            >
              {loading ? (
                <>
                  <div className="fr-spinner" /> {t("Submitting...")}
                </>
              ) : (
                t("Submit for Verification")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
