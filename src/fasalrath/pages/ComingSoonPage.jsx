import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ComingSoonPage({ title, icon = "🚧", description }) {
  const { t } = useTranslation();
  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t(title)}</span>
        </div>
        <div className="fr-page-title">{icon} {t(title)}</div>
      </div>

      <div className="fr-card" style={{ textAlign: "center", padding: "60px 40px" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{icon}</div>
        <div style={{
          fontFamily: "var(--fr-font-display)",
          fontSize: 24, fontWeight: 700,
          color: "var(--fr-slate)", marginBottom: 12,
        }}>
          {t(title)}
        </div>
        <div style={{
          fontSize: 15, color: "var(--fr-text-light)",
          maxWidth: 480, margin: "0 auto 28px",
          lineHeight: 1.7,
        }}>
          {description
            ? t(description)
            : t("This feature is being built and will be available soon. You can access it from the mobile app in the meantime.")
          }
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/fasalrath/dashboard" className="fr-btn fr-btn-teal" style={{ width: "auto" }}>
            ← {t("Back to Dashboard")}
          </Link>
          <a
            href="https://play.google.com/store/apps"
            className="fr-btn fr-btn-ghost"
            style={{ width: "auto" }}
            target="_blank" rel="noreferrer"
          >
            📱 {t("Open in App")}
          </a>
        </div>
      </div>
    </div>
  );
}
