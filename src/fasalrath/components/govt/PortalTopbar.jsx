// src/fasalrath/components/govt/PortalTopbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हि" },
  { code: "bho", label: "भो" },
];

export default function GovtPortalTopbar() {
  const { t, i18n } = useTranslation();
  const { employee, isAuthenticated, logout } = useGovtAuth();
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/fasalrath/govt/login");
  };

  return (
    <header className="fr-topbar" style={{ background: "#606C38" }}>
      <div className="fr-topbar-inner">
        <Link
          to={isAuthenticated ? "/fasalrath/govt/dashboard" : "/fasalrath/govt"}
          className="fr-topbar-logo"
        >
          <div className="fr-topbar-logo-icon">🏛️</div>
          <div className="fr-topbar-logo-text">
            <span className="fr-topbar-logo-name">FasalRath</span>
            <span className="fr-topbar-logo-sub">{t("Government Portal")}</span>
          </div>
        </Link>

        <div className="fr-topbar-actions">
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
                  background:
                    i18n.language === code
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  color:
                    i18n.language === code ? "white" : "rgba(255,255,255,0.55)",
                  borderColor:
                    i18n.language === code
                      ? "rgba(255,255,255,0.5)"
                      : "transparent",
                  fontFamily: "var(--fr-font-body)",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                className="fr-topbar-btn"
                onClick={() => setShowAccount(!showAccount)}
              >
                <span className="fr-topbar-btn-label">
                  {t("Hello")}, {employee?.name?.split(" ")[0] || t("Officer")}
                </span>
                <span className="fr-topbar-btn-value">{t("Account")} ▾</span>
              </button>

              {showAccount && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    background: "white",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    border: "1px solid #e2e8f0",
                    minWidth: 200,
                    zIndex: 200,
                    overflow: "hidden",
                  }}
                  onMouseLeave={() => setShowAccount(false)}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #e2e8f0",
                      background: "#f8f9fa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {employee?.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}
                    >
                      {employee?.department}
                    </div>
                  </div>
                  {[
                    {
                      label: t("Dashboard"),
                      path: "/fasalrath/govt/dashboard",
                      icon: "📊",
                    },
                    {
                      label: t("Profile"),
                      path: "/fasalrath/govt/profile",
                      icon: "👤",
                    },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowAccount(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 16px",
                        textDecoration: "none",
                        color: "#334155",
                        fontSize: 14,
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f1f5f9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: "1px solid #e2e8f0" }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#e76f51",
                        fontSize: 14,
                        fontFamily: "var(--fr-font-body)",
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fdf0ed")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span>🚪</span> {t("Logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/fasalrath/govt/login" className="fr-topbar-btn">
              <span className="fr-topbar-btn-label">{t("Hello, sign in")}</span>
              <span className="fr-topbar-btn-value">{t("Account")} ▾</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
