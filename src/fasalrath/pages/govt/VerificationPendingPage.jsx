// src/fasalrath/pages/govt/VerificationPendingPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function GovtVerificationPendingPage() {
  const { t } = useTranslation();
  const { employee, authFetch, updateEmployeeLocal, logout } = useGovtAuth();
  const [checking, setChecking] = React.useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/govt/auth/profile`);
      if (res.ok) {
        const data = await res.json();
        if (data.employee.verificationStatus === "verified") {
          updateEmployeeLocal({ verificationStatus: "verified" });
          alert(t("Your profile has been verified!"));
          window.location.href = "/fasalrath/govt/dashboard";
        } else if (data.employee.verificationStatus === "rejected") {
          alert(
            t("Your profile verification was rejected") +
              (data.employee.rejectionReason
                ? `: ${data.employee.rejectionReason}`
                : ""),
          );
          logout();
        } else {
          alert(t("Verification is still pending"));
        }
      }
    } catch (err) {
      alert(t("Failed to check status"));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up" style={{ maxWidth: 500 }}>
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark" style={{ background: "#F4A261" }}>
            ⏳
          </div>
          <div className="fr-auth-title">{t("Verification Pending")}</div>
          <div className="fr-auth-subtitle">
            {t("Your profile is currently under review")}
          </div>
        </div>

        <div className="fr-auth-body">
          <div className="fr-alert fr-alert-info">
            <span>ℹ️</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {t("What happens next?")}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                {t(
                  "Our team will review your documents and information. This process typically takes 1-2 business days. You will receive a notification once verified.",
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "var(--fr-off)",
              borderRadius: 8,
              padding: 16,
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--fr-border)",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
                {t("Submitted By")}:
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {employee?.name || t("You")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--fr-border)",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
                {t("Phone")}:
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {employee?.phone}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
              }}
            >
              <span style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
                {t("Status")}:
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F4A261" }}>
                {t("Pending Review")}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 24,
            }}
          >
            <button
              onClick={checkStatus}
              disabled={checking}
              className="fr-btn fr-btn-teal"
              style={{ background: "#606C38" }}
            >
              {checking ? (
                <>
                  <div className="fr-spinner" /> {t("Checking...")}
                </>
              ) : (
                t("Check Verification Status")
              )}
            </button>

            <button onClick={logout} className="fr-btn fr-btn-ghost">
              {t("Sign Out")}
            </button>
          </div>

          <div
            style={{
              marginTop: 24,
              textAlign: "center",
              fontSize: 12,
              color: "var(--fr-text-light)",
            }}
          >
            {t("Need help? Contact administration at:")}
            <div style={{ fontWeight: 600, color: "#606C38", marginTop: 4 }}>
              support@agriportal.gov.in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
