import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";

const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { key: "dashboard", label: "Dashboard", path: "/fasalrath/vendor/dashboard", icon: "🏠" },
      { key: "profile", label: "My Profile", path: "/fasalrath/vendor/profile", icon: "👤" },
    ],
  },
  {
    title: "Business",
    items: [
      { key: "products", label: "My Products", path: "/fasalrath/vendor/products", icon: "🏪" },
      { key: "orders", label: "Orders", path: "/fasalrath/vendor/orders", icon: "📦" },
    ],
  },
  {
    title: "Finance",
    items: [
      { key: "transactions", label: "Transactions", path: "/fasalrath/vendor/transactions", icon: "💳" },
    ],
  },
];

export default function VendorPortalSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { vendor, logout } = useVendorAuth();

  const initial = vendor?.name
    ? vendor.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "V";

  return (
    <aside className="fr-sidebar">
      <div className="fr-sidebar-user">
        <div className="fr-sidebar-avatar" style={{ background: "linear-gradient(135deg, #457B9D, #1D3557)" }}>
          {initial}
        </div>
        <div className="fr-sidebar-name">{vendor?.name || t("Vendor")}</div>
        <div className="fr-sidebar-phone">
          +91 {vendor?.phone?.replace("+91", "") || ""}
        </div>
        <div className="fr-sidebar-badge" style={{ background: "rgba(69, 123, 157, 0.1)", color: "#457B9D" }}>
          🏪 {t("Vendor")}
        </div>
      </div>

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
          onClick={() => { logout(); navigate("/fasalrath/vendor/login"); }}
          style={{ color: "#e76f51" }}
        >
          <span className="fr-sidebar-link-icon">🚪</span>
          {t("Logout")}
        </button>
      </nav>
    </aside>
  );
}
