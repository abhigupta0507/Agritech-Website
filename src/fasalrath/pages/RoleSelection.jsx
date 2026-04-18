// src/fasalrath/pages/RoleSelection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/role-selection.css";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bho", label: "भोजपुरी" },
];

export default function RoleSelection() {
  const { t, i18n } = useTranslation();

  return (
    <div className="rs-page">
      <div className="rs-lang-bar">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={`rs-lang-pill ${i18n.language === l.code ? "active" : ""}`}
            onClick={() => i18n.changeLanguage(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="rs-container">
        <div className="rs-header">
          <div className="rs-logo">🌾</div>
          <h1 className="rs-title">{t("Welcome to FasalRath")}</h1>
          <p className="rs-subtitle">{t("How would you like to continue?")}</p>
        </div>

        <div className="rs-roles">
          <Link to="/fasalrath/farmer/login" className="rs-role-card rs-farmer">
            <div className="rs-role-icon">🌾</div>
            <h2 className="rs-role-title">{t("I am a Farmer")}</h2>
            <p className="rs-role-desc">
              {t("Manage crops, track harvests, quality certificates")}
            </p>
          </Link>

          <Link to="/fasalrath/vendor/login" className="rs-role-card rs-vendor">
            <div className="rs-role-icon">🏪</div>
            <h2 className="rs-role-title">{t("I am a Vendor")}</h2>
            <p className="rs-role-desc">
              {t("Sell seeds, fertilizers, equipment")}
            </p>
          </Link>

          <Link to="/fasalrath/buyer/login" className="rs-role-card rs-buyer">
            <div className="rs-role-icon">💼</div>
            <h2 className="rs-role-title">{t("I am a Buyer")}</h2>
            <p className="rs-role-desc">
              {t("Purchase crops, post requirements")}
            </p>
          </Link>

          <Link to="/fasalrath/govt/login" className="rs-role-card rs-govt">
            <div className="rs-role-icon">🏛️</div>
            <h2 className="rs-role-title">{t("Government Login")}</h2>
            <p className="rs-role-desc">
              {t("Quality inspection, MSP compliance")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
