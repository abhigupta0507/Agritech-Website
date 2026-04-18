// src/fasalrath/pages/vendor/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorProfilePage() {
  const { t } = useTranslation();
  const { vendor, authFetch, updateVendorLocal, logout } = useVendorAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: vendor?.name || "",
    organizationName: vendor?.organizationName || "",
    gstNumber: vendor?.gstNumber || "",
    address: vendor?.address || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setForm({
      name: vendor?.name || "",
      organizationName: vendor?.organizationName || "",
      gstNumber: vendor?.gstNumber || "",
      address: vendor?.address || "",
    });
  }, [vendor]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setApiError("");
    setSuccess(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Name is required");
    if (!form.organizationName.trim())
      errs.organizationName = t("Organization name is required");
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
        `${API_BASE_URL}/api/vendor/auth/update-profile`,
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
      updateVendorLocal({ ...data.vendor });
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
      name: vendor?.name || "",
      organizationName: vendor?.organizationName || "",
      gstNumber: vendor?.gstNumber || "",
      address: vendor?.address || "",
    });
  };

  const initial = vendor?.name
    ? vendor.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "V";

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
                background: "linear-gradient(135deg, #457B9D, #1D3557)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--fr-font-display)",
                fontSize: 28,
                fontWeight: 800,
                color: "white",
                margin: "0 auto 16px",
                boxShadow: "0 4px 16px rgba(69,123,157,0.35)",
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
              {vendor?.name || t("Vendor")}
            </div>

            <div
              style={{
                fontFamily: "var(--fr-font-mono)",
                fontSize: 14,
                color: "var(--fr-text-light)",
                marginBottom: 16,
              }}
            >
              +91 {vendor?.phone?.replace("+91", "") || ""}
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
                style={{ background: "#457B9D", color: "white" }}
              >
                🏪 {t("Vendor")}
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
                ✅ +91 {vendor?.phone?.replace("+91", "") || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="fr-card">
          <div className="fr-card-header">
            <span className="fr-card-title">{t("Business Details")}</span>
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
                    label: t("Full Name"),
                    value: vendor?.name || "—",
                    icon: "👤",
                  },
                  {
                    label: t("Mobile Number"),
                    value: `+91 ${vendor?.phone?.replace("+91", "") || ""}`,
                    icon: "📱",
                    mono: true,
                  },
                  {
                    label: t("Organization"),
                    value: vendor?.organizationName || "—",
                    icon: "🏪",
                  },
                  {
                    label: t("GST Number"),
                    value: vendor?.gstNumber || "—",
                    icon: "📋",
                    mono: true,
                  },
                  {
                    label: t("Address"),
                    value: vendor?.address || "—",
                    icon: "🏡",
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
                  <label className="fr-label">{t("Full Name")} *</label>
                  <input
                    className={`fr-input ${errors.name ? "error" : ""}`}
                    value={form.name}
                    onChange={set("name")}
                    placeholder={t("Your full name")}
                  />
                  {errors.name && (
                    <div className="fr-input-error">
                      <span>⚠</span> {errors.name}
                    </div>
                  )}
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Mobile Number")}</label>
                  <input
                    className="fr-input"
                    value={`+91 ${vendor?.phone?.replace("+91", "") || ""}`}
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
                  <label className="fr-label">{t("Organization Name")} *</label>
                  <input
                    className={`fr-input ${errors.organizationName ? "error" : ""}`}
                    value={form.organizationName}
                    onChange={set("organizationName")}
                    placeholder={t("Shop/Business name")}
                  />
                  {errors.organizationName && (
                    <div className="fr-input-error">
                      <span>⚠</span> {errors.organizationName}
                    </div>
                  )}
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("GST Number")}</label>
                  <input
                    className="fr-input"
                    value={form.gstNumber}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        gstNumber: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div className="fr-form-group" style={{ marginBottom: 0 }}>
                  <label className="fr-label">{t("Business Address")}</label>
                  <textarea
                    className="fr-input"
                    value={form.address}
                    onChange={set("address")}
                    placeholder={t("Shop No, Market, City")}
                    rows={3}
                    style={{ resize: "vertical" }}
                  />
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
