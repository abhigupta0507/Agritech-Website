import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { farmer, authFetch, updateFarmerLocal } = useFarmerAuth();

  const [form, setForm] = useState({
    name: "",
    address: "",
    adharNumber: "",
    district: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Name is required");
    if (!form.district.trim()) errs.district = t("District is required");
    if (!form.address.trim()) errs.address = t("Address is required");
    if (form.adharNumber && form.adharNumber.replace(/\D/g, "").length !== 12)
      errs.adharNumber = t("Aadhaar must be 12 digits");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/api/farmer-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          adharNumber: form.adharNumber.replace(/\D/g, ""),
          district: form.district,
          coordinates: null, // Map selection can be added later
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || t("Registration failed"));
      }
      const data = await res.json();
      updateFarmerLocal({ ...data.farmer, profileComplete: true });
      navigate("/fasalrath/dashboard", { replace: true });
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        navigate("/fasalrath/login", { replace: true });
      } else {
        setApiError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up" style={{ maxWidth: 480 }}>
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark">📋</div>
          <div className="fr-auth-title">{t("Complete Your Profile")}</div>
          <div className="fr-auth-subtitle">
            {t("Just a few details to get you started")}
          </div>
        </div>

        <div className="fr-auth-body">
          {apiError && (
            <div className="fr-alert fr-alert-error">
              <span>⚠</span> {apiError}
            </div>
          )}

          <div className="fr-alert fr-alert-info">
            <span>ℹ️</span>
            <span>
              {t("Your mobile number is already verified")}: <strong>+91 {farmer?.phone?.replace("+91", "")}</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="fr-form-group">
              <label className="fr-label">{t("Full Name")} *</label>
              <input
                className={`fr-input ${errors.name ? "error" : ""}`}
                type="text"
                placeholder={t("e.g. Ram Singh")}
                value={form.name}
                onChange={set("name")}
                autoFocus
              />
              {errors.name && <div className="fr-input-error"><span>⚠</span> {errors.name}</div>}
            </div>

            {/* Aadhaar */}
            <div className="fr-form-group">
              <label className="fr-label">{t("Aadhaar Number")}</label>
              <input
                className={`fr-input ${errors.adharNumber ? "error" : ""}`}
                type="text"
                inputMode="numeric"
                placeholder="XXXX XXXX XXXX"
                value={form.adharNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                  setForm(f => ({ ...f, adharNumber: val }));
                  setErrors(er => ({ ...er, adharNumber: "" }));
                }}
                maxLength={12}
              />
              {errors.adharNumber
                ? <div className="fr-input-error"><span>⚠</span> {errors.adharNumber}</div>
                : <div className="fr-input-hint">{t("Used for identity verification only")}</div>
              }
            </div>

            {/* District */}
            <div className="fr-form-group">
              <label className="fr-label">{t("District")} *</label>
              <input
                className={`fr-input ${errors.district ? "error" : ""}`}
                type="text"
                placeholder={t("e.g. Varanasi")}
                value={form.district}
                onChange={set("district")}
              />
              {errors.district && <div className="fr-input-error"><span>⚠</span> {errors.district}</div>}
              <div className="fr-input-hint">{t("Used for leaderboard and MSP rates")}</div>
            </div>

            {/* Address */}
            <div className="fr-form-group">
              <label className="fr-label">{t("Farm Address")} *</label>
              <textarea
                className={`fr-input ${errors.address ? "error" : ""}`}
                placeholder={t("Village, Tehsil, District")}
                value={form.address}
                onChange={set("address")}
                rows={3}
                style={{ resize: "vertical", minHeight: 80 }}
              />
              {errors.address && <div className="fr-input-error"><span>⚠</span> {errors.address}</div>}
            </div>

            <button
              type="submit"
              className="fr-btn fr-btn-teal"
              disabled={loading}
            >
              {loading
                ? <><div className="fr-spinner" /> {t("Saving...")}</>
                : t("Complete Registration →")
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
