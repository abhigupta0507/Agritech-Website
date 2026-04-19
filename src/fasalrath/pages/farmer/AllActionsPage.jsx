import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/all-actions.css";

const QUICK_ACTIONS = [
  {
    label: "Expense Predictor",
    path: "/fasalrath/farmer/expense-prediction",
    icon: "💹",
    bg: "#e8f5f3",
    color: "#1a7a6e",
  },
  {
    label: "Marketplace",
    path: "/fasalrath/farmer/marketplace",
    icon: "🛒",
    bg: "#fef7ee",
    color: "#c2681e",
  },
  {
    label: "Price Forecast",
    path: "/fasalrath/farmer/price-forecast",
    icon: "📈",
    bg: "#fdf0ed",
    color: "#c04a38",
  },
  {
    label: "Weather & Alerts",
    path: "/fasalrath/farmer/weather",
    icon: "⛅",
    bg: "#f0fdf4",
    color: "#16a34a",
  },
  {
    label: "Crop Guide",
    path: "/fasalrath/farmer/recommendations",
    icon: "🌱",
    bg: "#eff6ff",
    color: "#2563eb",
  },
  {
    label: "IoT Devices",
    path: "/fasalrath/farmer/iot",
    icon: "📡",
    bg: "#faf5ff",
    color: "#7c3aed",
  },
  {
    label: "My Orders",
    path: "/fasalrath/farmer/orders",
    icon: "📦",
    bg: "#fff7ed",
    color: "#ea580c",
  },
  {
    label: "My Certificates",
    path: "/fasalrath/farmer/quality",
    icon: "📜",
    bg: "#f0fdf4",
    color: "#16a34a",
  },
  {
    label: "My Offers",
    path: "/fasalrath/farmer/offers",
    icon: "🤝",
    bg: "#eff6ff",
    color: "#2563eb",
  },
  {
    label: "Transaction History",
    path: "/fasalrath/farmer/wallet",
    icon: "💰",
    bg: "#fdf4ff",
    color: "#9333ea",
  },
  {
    label: "Pre-Harvest Marketplace",
    path: "/fasalrath/farmer/feed",
    icon: "🌾",
    bg: "#fef7ee",
    color: "#c2681e",
  },
  {
    label: "View MSP",
    path: "/fasalrath/farmer/msp",
    icon: "📊",
    bg: "#faf5ff",
    color: "#7c3aed",
  },
];

export default function AllActionsPage() {
  const { t } = useTranslation();

  return (
    <div className="aa-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("All Features")}</span>
        </div>
        <div className="fr-page-title">⚡ {t("Quick Actions")}</div>
      </div>

      <div className="aa-grid">
        {QUICK_ACTIONS.map((action, i) => (
          <Link
            key={action.label}
            to={action.path}
            className={`aa-card fr-slide-up fr-stagger-${(i % 4) + 1}`}
          >
            <div className="aa-icon" style={{ background: action.bg }}>
              {action.icon}
            </div>
            <div className="aa-label" style={{ color: action.color }}>
              {t(action.label)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}