import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              AgriTech<span>IIT(BHU)</span>
            </div>
            <p>
              {t(
                "One platform connecting Farmers, Buyers, Agri-Vendors & Government",
              )}{" "}
              —{" "}
              {t("Built for Bharat. Empowering every farmer with technology.")}
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <span className="badge-pill">🇮🇳 {t("Made in India")}</span>
              <span className="badge-pill">
                {t("English · हिंदी · भोजपुरी")}
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t("Platform")}</h4>
            <NavLink to="/">{t("Home")}</NavLink>
            <NavLink to="/how-it-works">{t("How It Works")}</NavLink>
            <NavLink to="/about">{t("About Us")}</NavLink>
            <NavLink to="/privacy">{t("Privacy Policy")}</NavLink>
          </div>

          <div className="footer-col">
            <h4>{t("Contact")}</h4>
            <a href="mailto:support@agritech.in">fasalrath@agritechiitbhu.in</a>
            <a href="#">{t("Download App")}</a>
            <a href="#">{t("Report an Issue")}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AgriTech. {t("All rights reserved.")}</span>
          <div className="footer-badges">
            <span className="badge-pill">{t("Govt. Integrated")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
