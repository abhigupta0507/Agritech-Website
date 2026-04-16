import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../context/FarmerAuthContext";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard",      path: "/fasalrath/dashboard",   icon: "🏠" },
      { key: "profile",   label: "My Profile",     path: "/fasalrath/profile",     icon: "👤" },
    ],
  },
  {
    title: "Farm",
    items: [
      { key: "farm",    label: "My Farm & Fields", path: "/fasalrath/farm",     icon: "🌾" },
      { key: "harvest", label: "My Harvest",       path: "/fasalrath/harvest",  icon: "🌽" },
      { key: "quality", label: "Quality Certs",    path: "/fasalrath/quality",  icon: "📜" },
    ],
  },
  {
    title: "Market",
    items: [
      { key: "market",  label: "Marketplace",      path: "/fasalrath/marketplace", icon: "🛒" },
      { key: "offers",  label: "My Offers",        path: "/fasalrath/offers",      icon: "🤝" },
      { key: "orders",  label: "Orders",           path: "/fasalrath/orders",      icon: "📦" },
    ],
  },
  {
    title: "Finance",
    items: [
      { key: "wallet",  label: "Wallet & Txns",    path: "/fasalrath/wallet",       icon: "💰" },
      { key: "msp",     label: "View MSP Rates",   path: "/fasalrath/msp",          icon: "📊" },
    ],
  },
  {
    title: "More",
    items: [
      { key: "weather",  label: "Weather & Alerts", path: "/fasalrath/weather",   icon: "⛅" },
      { key: "quizzes",  label: "Quizzes",          path: "/fasalrath/quizzes",   icon: "📚" },
      { key: "devices",  label: "IoT Devices",      path: "/fasalrath/iot",       icon: "📡" },
    ],
  },
];

export default function PortalSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { farmer, logout } = useFarmerAuth();

  const initial = farmer?.name
    ? farmer.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "F";

  return (
    <aside className="fr-sidebar">
      {/* User card */}
      <div className="fr-sidebar-user">
        <div className="fr-sidebar-avatar">{initial}</div>
        <div className="fr-sidebar-name">{farmer?.name || t("Farmer")}</div>
        <div className="fr-sidebar-phone">
          +91 {farmer?.phone?.replace("+91", "") || ""}
        </div>
        <div className="fr-sidebar-badge">
          🏅 {t(farmer?.level || "Bronze")} · {farmer?.totalPoints || 0} {t("pts")}
        </div>
      </div>

      {/* Nav */}
      <nav className="fr-sidebar-nav">
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.title}>
            {si > 0 && <div className="fr-sidebar-divider" />}
            <div className="fr-sidebar-section">{t(section.title)}</div>
            {section.items.map(item => (
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
          onClick={() => { logout(); navigate("/fasalrath/login"); }}
          style={{ color: "#e76f51" }}
        >
          <span className="fr-sidebar-link-icon">🚪</span>
          {t("Logout")}
        </button>
      </nav>
    </aside>
  );
}
