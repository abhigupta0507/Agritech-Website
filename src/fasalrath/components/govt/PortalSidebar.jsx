// src/fasalrath/components/govt/PortalSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: "/fasalrath/govt/dashboard",
        icon: "📊",
      },
      {
        key: "profile",
        label: "My Profile",
        path: "/fasalrath/govt/profile",
        icon: "👤",
      },
    ],
  },
  {
    title: "Work",
    items: [
      {
        key: "quality",
        label: "Quality Grading",
        path: "/fasalrath/govt/quality-grading",
        icon: "✅",
      },
      {
        key: "msp",
        label: "MSP Compliance",
        path: "/fasalrath/govt/msp-compliance",
        icon: "🛡️",
      },
    ],
  },
];

export default function GovtPortalSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { employee, logout } = useGovtAuth();

  const initial = employee?.name
    ? employee.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "G";

  return (
    <aside className="fr-sidebar">
      <div className="fr-sidebar-user">
        <div className="fr-sidebar-avatar" style={{ background: "#606C38" }}>
          {initial}
        </div>
        <div className="fr-sidebar-name">{employee?.name || t("Officer")}</div>
        <div className="fr-sidebar-phone">
          {employee?.department || t("Government")}
        </div>
        <div
          className="fr-sidebar-badge"
          style={{ background: "#F0F2E6", color: "#606C38" }}
        >
          🏛️ {t(employee?.designation || "Officer")}
        </div>
      </div>

      <nav className="fr-sidebar-nav">
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.title}>
            {si > 0 && <div className="fr-sidebar-divider" />}
            <div className="fr-sidebar-section">{t(section.title)}</div>
            {section.items.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`fr-sidebar-link ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="fr-sidebar-link-icon">{item.icon}</span>
                {t(item.label)}
              </Link>
            ))}
          </div>
        ))}

        <div className="fr-sidebar-divider" />
        <button
          className="fr-sidebar-link"
          onClick={() => {
            logout();
            navigate("/fasalrath/govt/login");
          }}
          style={{ color: "#e76f51" }}
        >
          <span className="fr-sidebar-link-icon">🚪</span>
          {t("Logout")}
        </button>
      </nav>
    </aside>
  );
}
