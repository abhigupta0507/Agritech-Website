import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../context/FarmerAuthContext";
import { API_BASE_URL } from "../config";

const QUICK_ACTIONS = [
  { label: "My Farm",         path: "/fasalrath/farm",        icon: "🌾", bg: "#e8f5f3", color: "#1a7a6e" },
  { label: "My Harvest",      path: "/fasalrath/harvest",     icon: "🌽", bg: "#fef7ee", color: "#c2681e" },
  { label: "Marketplace",     path: "/fasalrath/marketplace", icon: "🛒", bg: "#fdf0ed", color: "#c04a38" },
  { label: "Quality Certs",   path: "/fasalrath/quality",     icon: "📜", bg: "#f0fdf4", color: "#16a34a" },
  { label: "My Offers",       path: "/fasalrath/offers",      icon: "🤝", bg: "#eff6ff", color: "#2563eb" },
  { label: "View MSP Rates",  path: "/fasalrath/msp",         icon: "📊", bg: "#faf5ff", color: "#7c3aed" },
  { label: "Expense Forecast",path: "/fasalrath/forecast",    icon: "💹", bg: "#fff7ed", color: "#ea580c" },
  { label: "Weather Alerts",  path: "/fasalrath/weather",     icon: "⛅", bg: "#f0f9ff", color: "#0284c7" },
  { label: "Knowledge Quiz",  path: "/fasalrath/quizzes",     icon: "📚", bg: "#fdf4ff", color: "#9333ea" },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const { farmer, authFetch } = useFarmerAuth();

  const [stats, setStats] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("Good morning");
    if (h < 17) return t("Good afternoon");
    return t("Good evening");
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, gRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/api/farm/stats`),
          authFetch(`${API_BASE_URL}/api/gamification/profile`),
        ]);
        if (sRes.ok) setStats(await sRes.json());
        if (gRes.ok) setGamification(await gRes.json());
      } catch {}
      finally { setLoadingStats(false); }
    };
    load();
  }, [authFetch]);

  const statCards = [
    {
      label: t("Total Land (acres)"),
      value: stats?.totalArea ?? "—",
      icon: "🌍", bg: "#e8f5f3", color: "#1a7a6e",
      change: null,
    },
    {
      label: t("Active Fields"),
      value: stats?.activeFields ?? "—",
      icon: "🌾", bg: "#fef7ee", color: "#c2681e",
    },
    {
      label: t("Active Alerts"),
      value: stats?.activeAlerts ?? "—",
      icon: "⚠️", bg: "#fdf0ed", color: "#c04a38",
    },
    {
      label: t("Points"),
      value: gamification?.totalPoints ?? "—",
      icon: "🏅", bg: "#faf5ff", color: "#7c3aed",
    },
  ];

  const scoreProgress = gamification ? (() => {
    const { level, totalPoints } = gamification;
    if (level === "Bronze") return { pct: Math.min((totalPoints / 499) * 100, 100), next: "Silver", target: 499 };
    if (level === "Silver") return { pct: Math.min(((totalPoints - 500) / 999) * 100, 100), next: "Gold", target: 1499 };
    return { pct: 100, next: null, target: null };
  })() : null;

  return (
    <div className="fr-fade-in">
      {/* Welcome banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--fr-slate) 0%, #264653 100%)",
        borderRadius: "var(--fr-radius-lg)",
        padding: "24px 28px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: 80,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(42,157,143,0.12)",
        }} />
        <div style={{
          position: "absolute", bottom: -30, right: -20,
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(244,162,97,0.1)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>
            {greeting()} 👋
          </div>
          <div style={{
            fontFamily: "var(--fr-font-display)",
            fontSize: 24, fontWeight: 800,
            color: "white", letterSpacing: "-0.3px", marginBottom: 8,
          }}>
            {farmer?.name || t("Farmer")}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {farmer?.district && (
              <span style={{
                background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)",
                borderRadius: 50, padding: "3px 12px", fontSize: 12, fontWeight: 500,
              }}>
                📍 {farmer.district}
              </span>
            )}
            {gamification && (
              <span style={{
                background: "rgba(255,215,0,0.2)", color: "#ffd700",
                borderRadius: 50, padding: "3px 12px", fontSize: 12, fontWeight: 700,
                border: "1px solid rgba(255,215,0,0.3)",
              }}>
                🏅 {t(gamification.level)} · {gamification.totalPoints} {t("pts")}
              </span>
            )}
          </div>
        </div>

        {/* Score progress */}
        {scoreProgress && (
          <div style={{
            position: "relative", zIndex: 1,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12, padding: "14px 18px",
            minWidth: 180, textAlign: "right",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              {scoreProgress.next ? `${t("Progress to")} ${t(scoreProgress.next)}` : t("Max Level!")}
            </div>
            <div style={{
              fontFamily: "var(--fr-font-display)",
              fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1,
            }}>
              {gamification?.totalPoints ?? 0}
              <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>
                {" "}/{scoreProgress.target}
              </span>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 50, height: 5, marginTop: 8, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${scoreProgress.pct}%`,
                background: "var(--fr-teal-light)",
                borderRadius: 50,
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="fr-stats-grid fr-gap-20">
        {statCards.map((s, i) => (
          <div key={s.label} className={`fr-stat-card fr-slide-up fr-stagger-${i + 1}`}>
            <div className="fr-stat-icon" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="fr-stat-value" style={{ color: s.color }}>
              {loadingStats ? (
                <div style={{
                  height: 28, width: 60,
                  background: "var(--fr-border)",
                  borderRadius: 6,
                  animation: "fr-pulse 1.5s infinite",
                }} />
              ) : s.value}
            </div>
            <div className="fr-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="fr-card fr-gap-20">
        <div className="fr-card-header">
          <span className="fr-card-title">⚡ {t("Quick Actions")}</span>
          <Link to="/fasalrath/all-actions" style={{ fontSize: 13, color: "var(--fr-teal)", textDecoration: "none", fontWeight: 600 }}>
            {t("See all")} →
          </Link>
        </div>
        <div className="fr-card-body">
          <div className="fr-quick-grid">
            {QUICK_ACTIONS.map((a, i) => (
              <Link
                key={a.label}
                to={a.path}
                className={`fr-quick-card fr-slide-up fr-stagger-${(i % 4) + 1}`}
              >
                <div className="fr-quick-icon" style={{ background: a.bg }}>
                  {a.icon}
                </div>
                <div className="fr-quick-label" style={{ color: "var(--fr-text-mid)" }}>
                  {t(a.label)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: recent activity + profile incomplete prompt */}
      <div className="fr-grid-2">
        {/* Profile completion prompt */}
        {farmer && !farmer.profileComplete && (
          <div className="fr-info-banner">
            <div style={{ fontSize: 24 }}>📋</div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--fr-teal-dark)", marginBottom: 4 }}>
                {t("Complete your profile")}
              </div>
              <div style={{ fontSize: 13, color: "var(--fr-teal)", marginBottom: 10 }}>
                {t("Add your Aadhaar and farm location to unlock all features.")}
              </div>
              <Link to="/fasalrath/profile" className="fr-btn fr-btn-teal fr-btn-sm" style={{ display: "inline-flex", width: "auto" }}>
                {t("Complete Profile →")}
              </Link>
            </div>
          </div>
        )}

        {/* Coming soon cards for features */}
        <div className="fr-card">
          <div className="fr-card-header">
            <span className="fr-card-title">📰 {t("Market Updates")}</span>
          </div>
          <div className="fr-card-body">
            {[
              { crop: "🌾 " + t("Wheat"),      price: "₹2,125", trend: "↑ 2.3%" },
              { crop: "🌽 " + t("Maize"),      price: "₹1,870", trend: "↓ 0.5%" },
              { crop: "🫘 " + t("Arhar (Tur)"), price: "₹6,600", trend: "↑ 1.1%" },
              { crop: "🌾 " + t("Paddy"),      price: "₹2,183", trend: "↑ 0.8%" },
            ].map(item => (
              <div key={item.crop} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0", borderBottom: "1px solid var(--fr-border)",
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--fr-text-mid)" }}>{item.crop}</span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fr-slate)" }}>{item.price}</div>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: item.trend.startsWith("↑") ? "var(--fr-success)" : "var(--fr-rust)",
                  }}>
                    {item.trend}
                  </div>
                </div>
              </div>
            ))}
            <Link to="/fasalrath/msp" style={{
              display: "block", textAlign: "center", marginTop: 14,
              fontSize: 13, fontWeight: 600, color: "var(--fr-teal)", textDecoration: "none",
            }}>
              {t("View all MSP rates")} →
            </Link>
          </div>
        </div>

        <div className="fr-card">
          <div className="fr-card-header">
            <span className="fr-card-title">📅 {t("Recent Activity")}</span>
          </div>
          <div className="fr-card-body fr-activity-list">
            {[
              { icon: "🌾", bg: "#e8f5f3", title: t("Wheat harvest logged"),     sub: t("North Field · 2 days ago"),  amt: null },
              { icon: "📜", bg: "#f0fdf4", title: t("Quality cert approved"),    sub: t("Basmati Rice · 1 week ago"),  amt: null },
              { icon: "💰", bg: "#fdf4ff", title: t("MSP sale payment received"), sub: t("Wheat · 120 quintals"),     amt: "+₹2,55,000", type: "income" },
              { icon: "🛒", bg: "#fef7ee", title: t("Seeds purchased"),          sub: t("Vendor Marketplace"),        amt: "-₹4,500",   type: "expense" },
            ].map((item, i) => (
              <div key={i} className="fr-activity-item">
                <div className="fr-activity-icon" style={{ background: item.bg }}>
                  {item.icon}
                </div>
                <div className="fr-activity-info">
                  <div className="fr-activity-title">{item.title}</div>
                  <div className="fr-activity-sub">{item.sub}</div>
                </div>
                {item.amt && (
                  <div className={`fr-activity-amount ${item.type}`}>{item.amt}</div>
                )}
              </div>
            ))}
            <Link to="/fasalrath/wallet" style={{
              display: "block", textAlign: "center", marginTop: 14,
              fontSize: 13, fontWeight: 600, color: "var(--fr-teal)", textDecoration: "none",
            }}>
              {t("View all transactions")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
