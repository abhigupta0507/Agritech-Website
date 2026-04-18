// src/fasalrath/pages/buyer/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

export default function BuyerProfilePage() {
  const { t } = useTranslation();
  const { buyer, authFetch, updateBuyerLocal, logout } = useBuyerAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    companyName: buyer?.companyName || "",
    contactPerson: buyer?.contactPerson || "",
    email: buyer?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setForm({
      companyName: buyer?.companyName || "",
      contactPerson: buyer?.contactPerson || "",
      email: buyer?.email || "",
    });
  }, [buyer]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setApiError("");
    setSuccess(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim())
      errs.companyName = t("Company name is required");
    if (!form.contactPerson.trim())
      errs.contactPerson = t("Contact person is required");
    if (form.email && form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email))
        errs.email = t("Please enter a valid email address");
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError("");
    setSuccess(false);
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/buyer/auth/update-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message);
      }
      const data = await res.json();
      updateBuyerLocal({ ...data.buyer });
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
      companyName: buyer?.companyName || "",
      contactPerson: buyer?.contactPerson || "",
      email: buyer?.email || "",
    });
  };

  const initial = buyer?.companyName
    ? buyer.companyName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "B";

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <span>{t("Profile")}</span>
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
        <div className="fr-card">
          <div
            className="fr-card-body"
            style={{ textAlign: "center", padding: 32 }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #E76F51, #C04A38)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--fr-font-display)",
                fontSize: 28,
                fontWeight: 800,
                color: "white",
                margin: "0 auto 16px",
                boxShadow: "0 4px 16px rgba(231,111,81,0.35)",
              }}
            >
              {initial}
            </div>

            <div
              style={{
                fontFamily: "var(--fr-font-display)",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--fr-slate)",
                marginBottom: 4,
              }}
            >
              {buyer?.companyName || t("Buyer")}
            </div>

            <div
              style={{
                fontFamily: "var(--fr-font-mono)",
                fontSize: 14,
                color: "var(--fr-text-light)",
                marginBottom: 16,
              }}
            >
              +91 {buyer?.phone?.replace("+91", "") || ""}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                className="fr-badge"
                style={{ background: "#E76F51", color: "white" }}
              >
                💼 {t("Buyer")}
              </span>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "var(--fr-off)",
                borderRadius: "var(--fr-radius)",
                border: "1px solid var(--fr-border)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--fr-text-light)",
                  marginBottom: 4,
                }}
              >
                {t("Mobile Verified")}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--fr-teal-dark)",
                }}
              >
                ✅ +91 {buyer?.phone?.replace("+91", "") || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="fr-card">
          <div className="fr-card-header">
            <span className="fr-card-title">{t("Company Details")}</span>
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
                  {loading ? (
                    <>
                      <div
                        className="fr-spinner"
                        style={{ width: 14, height: 14 }}
                      />{" "}
                      {t("Saving...")}
                    </>
                  ) : (
                    t("Save Changes")
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="fr-card-body">
            {!editing ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {[
                  {
                    label: t("Company Name"),
                    value: buyer?.companyName || "—",
                    icon: "🏢",
                  },
                  {
                    label: t("Contact Person"),
                    value: buyer?.contactPerson || "—",
                    icon: "👤",
                  },
                  {
                    label: t("Mobile Number"),
                    value: `+91 ${buyer?.phone?.replace("+91", "") || ""}`,
                    icon: "📱",
                    mono: true,
                  },
                  {
                    label: t("Email"),
                    value: buyer?.email || "—",
                    icon: "📧",
                    mono: true,
                  },
                ].map((field) => (
                  <div key={field.label} className="fr-profile-field">
                    <div className="fr-profile-label">{field.label}</div>
                    <div
                      className={`fr-profile-value ${field.mono ? "mono" : ""}`}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span>{field.icon}</span>
                      <span>{field.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Company Name")} *</label>
                  <input
                    className={`fr-input ${errors.companyName ? "error" : ""}`}
                    value={form.companyName}
                    onChange={set("companyName")}
                    placeholder={t("Company name")}
                  />
                  {errors.companyName && (
                    <div className="fr-input-error">
                      <span>⚠</span> {errors.companyName}
                    </div>
                  )}
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Contact Person")} *</label>
                  <input
                    className={`fr-input ${errors.contactPerson ? "error" : ""}`}
                    value={form.contactPerson}
                    onChange={set("contactPerson")}
                    placeholder={t("Contact person name")}
                  />
                  {errors.contactPerson && (
                    <div className="fr-input-error">
                      <span>⚠</span> {errors.contactPerson}
                    </div>
                  )}
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Mobile Number")}</label>
                  <input
                    className="fr-input"
                    value={`+91 ${buyer?.phone?.replace("+91", "") || ""}`}
                    disabled
                    style={{
                      background: "var(--fr-off)",
                      color: "var(--fr-text-light)",
                    }}
                  />
                  <div className="fr-input-hint">
                    ✅ {t("Verified — cannot be changed")}
                  </div>
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Email")}</label>
                  <input
                    className={`fr-input ${errors.email ? "error" : ""}`}
                    value={form.email}
                    onChange={set("email")}
                    type="email"
                    placeholder={t("Business email")}
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <div className="fr-input-error">
                      <span>⚠</span> {errors.email}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fr-card" style={{ marginTop: 20 }}>
        <div className="fr-card-header">
          <span className="fr-card-title">⚙️ {t("Account Actions")}</span>
        </div>
        <div className="fr-card-body">
          <button
            onClick={logout}
            className="fr-btn"
            style={{ background: "#E76F51", color: "white", width: "auto" }}
          >
            🚪 {t("Logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
