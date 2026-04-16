import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../context/FarmerAuthContext";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "bho", label: "भो" },
];

const NAV_ITEMS = [
  { key: "home",       label: "My Dashboard",     path: "/fasalrath/dashboard",   icon: "🏠" },
  { key: "farm",       label: "My Farm",           path: "/fasalrath/farm",        icon: "🌾" },
  { key: "harvest",    label: "My Harvest",        path: "/fasalrath/harvest",     icon: "🌽" },
  { key: "market",     label: "Marketplace",       path: "/fasalrath/marketplace", icon: "🛒" },
  { key: "quality",    label: "Quality Certs",     path: "/fasalrath/quality",     icon: "📜" },
  { key: "offers",     label: "My Offers",         path: "/fasalrath/offers",      icon: "🤝" },
  { key: "orders",     label: "Orders",            path: "/fasalrath/orders",      icon: "📦" },
  { key: "wallet",     label: "Wallet",            path: "/fasalrath/wallet",      icon: "💰" },
];

export default function PortalTopbar() {
  const { t, i18n } = useTranslation();
  const { farmer, isAuthenticated, logout } = useFarmerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccount, setShowAccount] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/fasalrath/login");
  };

  return (
    <header className="fr-topbar">
      <div className="fr-topbar-inner">
        {/* Logo */}
        <Link to={isAuthenticated ? "/fasalrath/dashboard" : "/fasalrath"} className="fr-topbar-logo">
          <div className="fr-topbar-logo-icon">🌾</div>
          <div className="fr-topbar-logo-text">
            <span className="fr-topbar-logo-name">FasalRath</span>
            <span className="fr-topbar-logo-sub">{t("Farmer Portal")}</span>
          </div>
        </Link>

        {/* Location (if farmer has address) */}
        {isAuthenticated && farmer?.address && (
          <div className="fr-topbar-location">
            <span className="fr-topbar-location-label">📍 {t("Farm")}</span>
            <span className="fr-topbar-location-value">
              {farmer.address.split(",")[0] || farmer.address}
            </span>
          </div>
        )}

        {/* Search */}
        {isAuthenticated && (
          <div className="fr-topbar-search">
            <select className="fr-topbar-search-select">
              <option value="all">{t("All")}</option>
              <option value="crops">{t("Crops")}</option>
              <option value="market">{t("Market")}</option>
            </select>
            <input
              className="fr-topbar-search-input"
              type="text"
              placeholder={t("Search crops, market prices, orders...")}
            />
            <button className="fr-topbar-search-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        )}

        {/* Right actions */}
        <div className="fr-topbar-actions">
          {/* Language switcher */}
          <div style={{ display: "flex", gap: 3 }}>
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                style={{
                  padding: "4px 9px",
                  borderRadius: 4,
                  border: "1px solid",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: i18n.language === code ? "rgba(255,255,255,0.2)" : "transparent",
                  color: i18n.language === code ? "white" : "rgba(255,255,255,0.55)",
                  borderColor: i18n.language === code ? "rgba(255,255,255,0.5)" : "transparent",
                  fontFamily: "var(--fr-font-body)",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="fr-topbar-btn-icon" style={{ position: "relative" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#e76f51",
                  border: "1.5px solid #1d3557",
                }} />
              </button>

              {/* Account dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  className="fr-topbar-btn"
                  onClick={() => setShowAccount(!showAccount)}
                >
                  <span className="fr-topbar-btn-label">
                    {t("Hello")}, {farmer?.name?.split(" ")[0] || t("Farmer")}
                  </span>
                  <span className="fr-topbar-btn-value">{t("Account & Lists")} ▾</span>
                </button>

                {showAccount && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", right: 0,
                    background: "white", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0", minWidth: 200, zIndex: 200,
                    overflow: "hidden",
                  }}
                  onMouseLeave={() => setShowAccount(false)}>
                    <div style={{
                      padding: "12px 16px", borderBottom: "1px solid #e2e8f0",
                      background: "#f8f9fa",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        {farmer?.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", fontFamily: "var(--fr-font-mono)", marginTop: 2 }}>
                        +91 {farmer?.phone?.replace("+91", "") || ""}
                      </div>
                    </div>
                    {[
                      { label: t("My Dashboard"), path: "/fasalrath/dashboard", icon: "🏠" },
                      { label: t("My Profile"),   path: "/fasalrath/profile",   icon: "👤" },
                      { label: t("My Farm"),      path: "/fasalrath/farm",      icon: "🌾" },
                    ].map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowAccount(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "10px 16px", textDecoration: "none",
                          color: "#334155", fontSize: 14, transition: "background 0.1s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span>{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid #e2e8f0" }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "10px 16px",
                          background: "none", border: "none", cursor: "pointer",
                          color: "#e76f51", fontSize: 14, fontFamily: "var(--fr-font-body)",
                          fontWeight: 600,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fdf0ed"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span>🚪</span> {t("Logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/fasalrath/login" className="fr-topbar-btn">
              <span className="fr-topbar-btn-label">{t("Hello, sign in")}</span>
              <span className="fr-topbar-btn-value">{t("Account & Lists")} ▾</span>
            </Link>
          )}
        </div>
      </div>

      {/* Sub-nav */}
      {isAuthenticated && (
        <nav className="fr-subnav">
          <div className="fr-subnav-inner">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.key}
                to={item.path}
                className={`fr-subnav-link ${location.pathname === item.path ? "active" : ""}`}
              >
                {item.icon} {t(item.label)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
