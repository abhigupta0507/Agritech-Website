import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { farmer, authFetch, updateFarmerLocal } = useFarmerAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:         farmer?.name || "",
    address:      farmer?.address || "",
    district:     farmer?.district || "",
    adharNumber:  farmer?.adharNumber || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  // Sync if farmer context changes
  useEffect(() => {
    setForm({
      name:        farmer?.name || "",
      address:     farmer?.address || "",
      district:    farmer?.district || "",
      adharNumber: farmer?.adharNumber || "",
    });
  }, [farmer]);

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrors(er => ({ ...er, [key]: "" }));
    setApiError("");
    setSuccess(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Name is required");
    if (!form.district.trim()) errs.district = t("District is required");
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    setSuccess(false);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/farmer-auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          district: form.district,
          adharNumber: form.adharNumber.replace(/\D/g, ""),
          coordinates: farmer?.coordinates || null,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      const data = await res.json();
      updateFarmerLocal({ ...data.farmer });
      setSuccess(true);
      setEditing(false);
    } catch (e) {
      setApiError(e.message || t("Failed to save changes"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setApiError("");
    setForm({
      name:        farmer?.name || "",
      address:     farmer?.address || "",
      district:    farmer?.district || "",
      adharNumber: farmer?.adharNumber || "",
    });
  };

  const initial = farmer?.name
    ? farmer.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "F";

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <a href="/fasalrath/dashboard">{t("Dashboard")}</a>
          <span>/</span>
          <span>{t("My Profile")}</span>
        </div>
        <div className="fr-page-title">👤 {t("My Profile")}</div>
      </div>

      {success && (
        <div className="fr-alert fr-alert-success fr-gap-20">
          <span>✅</span> {t("Profile updated successfully!")}
        </div>
      )}
      {apiError && (
        <div className="fr-alert fr-alert-error fr-gap-20">
          <span>⚠</span> {apiError}
        </div>
      )}

      <div className="fr-grid-2">
        {/* Left: Identity card */}
        <div className="fr-card">
          <div className="fr-card-body" style={{ textAlign: "center", padding: 32 }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--fr-teal-light), var(--fr-teal-dark))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--fr-font-display)",
              fontSize: 28, fontWeight: 800, color: "white",
              margin: "0 auto 16px",
              boxShadow: "0 4px 16px rgba(42,157,143,0.35)",
            }}>
              {initial}
            </div>

            <div style={{
              fontFamily: "var(--fr-font-display)",
              fontSize: 20, fontWeight: 700, color: "var(--fr-slate)", marginBottom: 4,
            }}>
              {farmer?.name || t("Farmer")}
            </div>

            <div style={{
              fontFamily: "var(--fr-font-mono)",
              fontSize: 14, color: "var(--fr-text-light)", marginBottom: 16,
            }}>
              +91 {farmer?.phone?.replace("+91", "") || ""}
            </div>

            {/* Level badge */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="fr-badge fr-badge-teal">
                🏅 {t(farmer?.level || "Bronze")}
              </span>
            </div>

            {/* Verification status */}
            <div style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "var(--fr-teal-pale)",
              borderRadius: "var(--fr-radius)",
              border: "1px solid rgba(42,157,143,0.2)",
            }}>
              <div style={{ fontSize: 12, color: "var(--fr-text-light)", marginBottom: 4 }}>
                {t("Mobile Verified")}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fr-teal-dark)" }}>
                ✅ +91 {farmer?.phone?.replace("+91", "") || ""}
              </div>
            </div>

            {farmer?.district && (
              <div style={{
                marginTop: 12,
                padding: "12px 16px",
                background: "var(--fr-off)",
                borderRadius: "var(--fr-radius)",
                border: "1px solid var(--fr-border)",
              }}>
                <div style={{ fontSize: 12, color: "var(--fr-text-light)", marginBottom: 4 }}>
                  {t("Registered District")}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fr-text)" }}>
                  📍 {farmer.district}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Editable fields */}
        <div className="fr-card">
          <div className="fr-card-header">
            <span className="fr-card-title">{t("Personal Details")}</span>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="fr-btn fr-btn-ghost fr-btn-sm"
              >
                ✏️ {t("Edit")}
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCancel}
                  className="fr-btn fr-btn-ghost fr-btn-sm"
                  disabled={loading}
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleSave}
                  className="fr-btn fr-btn-teal fr-btn-sm"
                  disabled={loading}
                >
                  {loading
                    ? <><div className="fr-spinner" style={{ width: 14, height: 14 }} /> {t("Saving...")}</>
                    : t("Save Changes")
                  }
                </button>
              </div>
            )}
          </div>

          <div className="fr-card-body">
            {!editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: t("Full Name"), value: farmer?.name || "—", icon: "👤" },
                  { label: t("Mobile Number"), value: `+91 ${farmer?.phone?.replace("+91", "") || ""}`, icon: "📱", mono: true },
                  { label: t("District"), value: farmer?.district || "—", icon: "📍" },
                  { label: t("Farm Address"), value: farmer?.address || "—", icon: "🏡" },
                  { label: t("Aadhaar"), value: farmer?.adharNumber ? `****${farmer.adharNumber.slice(-4)}` : "—", icon: "🪪", mono: true },
                ].map(field => (
                  <div key={field.label} className="fr-profile-field">
                    <div className="fr-profile-label">{field.label}</div>
                    <div className={`fr-profile-value ${field.mono ? "mono" : ""}`} style={{
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span>{field.icon}</span>
                      <span>{field.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Full Name")} *</label>
                  <input
                    className={`fr-input ${errors.name ? "error" : ""}`}
                    value={form.name}
                    onChange={set("name")}
                    placeholder={t("Your full name")}
                  />
                  {errors.name && <div className="fr-input-error"><span>⚠</span> {errors.name}</div>}
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Mobile Number")}</label>
                  <input
                    className="fr-input"
                    value={`+91 ${farmer?.phone?.replace("+91", "") || ""}`}
                    disabled
                    style={{ background: "var(--fr-off)", color: "var(--fr-text-light)" }}
                  />
                  <div className="fr-input-hint">✅ {t("Verified — cannot be changed")}</div>
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("District")} *</label>
                  <input
                    className={`fr-input ${errors.district ? "error" : ""}`}
                    value={form.district}
                    onChange={set("district")}
                    placeholder={t("e.g. Varanasi")}
                  />
                  {errors.district && <div className="fr-input-error"><span>⚠</span> {errors.district}</div>}
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Farm Address")}</label>
                  <textarea
                    className="fr-input"
                    value={form.address}
                    onChange={set("address")}
                    placeholder={t("Village, Tehsil, District")}
                    rows={3}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Aadhaar Number")}</label>
                  <input
                    className={`fr-input ${errors.adharNumber ? "error" : ""}`}
                    value={form.adharNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                      setForm(f => ({ ...f, adharNumber: val }));
                    }}
                    placeholder="XXXX XXXX XXXX"
                    inputMode="numeric"
                  />
                  {errors.adharNumber
                    ? <div className="fr-input-error"><span>⚠</span> {errors.adharNumber}</div>
                    : <div className="fr-input-hint">{t("Stored securely, used for verification only")}</div>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement summary */}
      <div className="fr-card" style={{ marginTop: 20 }}>
        <div className="fr-card-header">
          <span className="fr-card-title">🏆 {t("My Achievements")}</span>
          {/* <a href="/fasalrath/quizzes" style={{ fontSize: 13, color: "var(--fr-teal)", textDecoration: "none", fontWeight: 600 }}>
            {t("View quizzes")} →
          </a> */}
        </div>
        <div className="fr-card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { icon: "🌾", label: t("Quality Pioneer"),     desc: t("Get first quality cert"),   locked: !farmer?.qualityCertCount },
              { icon: "📚", label: t("Knowledge Champion"),  desc: t("Complete all quizzes"),      locked: true },
              { icon: "🔨", label: t("Auction Pro"),         desc: t("Win 5 auctions"),            locked: true },
              { icon: "🌱", label: t("Soil Scientist"),      desc: t("Add IoT soil sensor"),       locked: true },
              { icon: "💰", label: t("Market Master"),       desc: t("Sell via marketplace"),      locked: true },
              { icon: "🤝", label: t("Contract Farmer"),     desc: t("Complete pre-harvest deal"), locked: true },
            ].map(badge => (
              <div key={badge.label} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, padding: 16,
                background: badge.locked ? "var(--fr-off)" : "var(--fr-teal-pale)",
                borderRadius: "var(--fr-radius)",
                border: `1px solid ${badge.locked ? "var(--fr-border)" : "rgba(42,157,143,0.25)"}`,
                opacity: badge.locked ? 0.6 : 1,
                transition: "all 0.2s",
              }}>
                <div style={{
                  fontSize: 28,
                  filter: badge.locked ? "grayscale(100%)" : "none",
                }}>
                  {badge.locked ? "🔒" : badge.icon}
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: badge.locked ? "var(--fr-text-light)" : "var(--fr-teal-dark)",
                  textAlign: "center",
                }}>
                  {badge.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--fr-text-xlight)", textAlign: "center", lineHeight: 1.3 }}>
                  {badge.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger zone - Account actions
      <div className="fr-card" style={{ marginTop: 20, borderColor: "#fecaca" }}>
        <div className="fr-card-header" style={{ borderColor: "#fecaca" }}>
          <span className="fr-card-title" style={{ color: "var(--fr-error)" }}>
            ⚠️ {t("Account Actions")}
          </span>
        </div>
        <div className="fr-card-body" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* <button
            className="fr-btn fr-btn-ghost fr-btn-sm"
            style={{ color: "var(--fr-error)", borderColor: "#fecaca" }}
            onClick={() => {
              if (window.confirm(t("Are you sure you want to logout from all devices?"))) {
                // TODO: call logout-all API
              }
            }}
          >
            🚪 {t("Logout from all devices")}
          </button> 
          <button
            className="fr-btn fr-btn-ghost fr-btn-sm"
            style={{ color: "var(--fr-error)", borderColor: "#fecaca" }}
            onClick={() => {
              if (window.confirm(t("Download all your data?"))) {
                // TODO: data export
              }
            }}
          >
            📥 {t("Download my data")}
          </button>
        </div>
      </div> */}
    </div>
  );
}
