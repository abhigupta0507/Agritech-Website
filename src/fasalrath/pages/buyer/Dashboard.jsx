// src/fasalrath/pages/buyer/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

export default function BuyerDashboardPage() {
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();

  const [recentRequirements, setRecentRequirements] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    requirementsCount: 0,
    activeBids: 0,
    wonBids: 0,
  });
  const [profileData, setProfileData] = useState(null);

  const quickActions = [
    {
      title: t("Marketplace"),
      icon: "🏪",
      color: "#2A9D8F",
      route: "/fasalrath/buyer/marketplace",
    },
    {
      title: t("My Bids"),
      icon: "⚖️",
      color: "#457B9D",
      route: "/fasalrath/buyer/bidding",
    },
    // {
    //   title: t("Requirements Offer"),
    //   icon: "📋",
    //   color: "#F4A261",
    //   route: "/fasalrath/buyer/requirement-offers",
    // },
    {
      title: t("Add New Requirements"),
      icon: "➕",
      color: "#E76F51",
      route: "/fasalrath/buyer/post-requirements",
    },
  ];

  const fetchBuyerProfile = async () => {
    if (!buyer) return;

    try {
      const res = await authFetch(`${API_BASE_URL}/api/buyer/auth/profile`);
      const data = await res.json();

      if (res.ok) {
        setRecentRequirements(data.recentRequirements || []);
        setDashboardStats(
          data.stats || {
            requirementsCount: 0,
            activeBids: 0,
            wonBids: 0,
          },
        );
        setProfileData(data.buyer);
      }
    } catch (error) {
      console.error(t("Failed to fetch buyer profile:"), error);
    }
  };

  useEffect(() => {
    if (buyer) {
      fetchBuyerProfile();
    }
  }, [buyer]);

  const stats = [
    {
      label: t("Requirements Posted"),
      value: dashboardStats.requirementsCount,
      icon: "📋",
      color: "#457B9D",
    },
    {
      label: t("Active Bids"),
      value: dashboardStats.activeBids,
      icon: "⚖️",
      color: "#E76F51",
    },
    {
      label: t("Contracts"),
      value: dashboardStats.wonBids,
      icon: "🤝",
      color: "#2A9D8F",
    },
  ];

  const getStatusStyle = (status) => {
    const safeStatus = status?.toLowerCase() || "";

    if (safeStatus === "active")
      return { bg: "#E0F2F1", text: "#2A9D8F", label: t("Bidding Open") };
    if (safeStatus === "won" || safeStatus === "contract")
      return { bg: "#FFF3E0", text: "#F4A261", label: t("Contract") };
    if (safeStatus === "fulfilled")
      return { bg: "#E8F5E9", text: "#43A047", label: t("Fulfilled") };

    return { bg: "#F1F3F5", text: "#666", label: t("Closed") };
  };

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("rice") || cat.includes("wheat")) return "🌾";
    if (cat.includes("fruit")) return "🍒";
    if (cat.includes("vegetable")) return "🍎";
    return "🌱";
  };

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px 0 50px",
            marginLeft: -20,
            marginRight: -20,
            paddingLeft: 20,
            paddingRight: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#4a4646", opacity: 0.9 }}>
                {t("Welcome back,")}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#000",
                  marginTop: 4,
                  maxWidth: 250,
                }}
              >
                {profileData?.companyName || buyer?.companyName || t("Buyer")}
              </div>
            </div>
            <Link to="/fasalrath/buyer/profile">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#E76F51",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#FFF",
                  fontSize: 20,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {(profileData?.companyName || buyer?.companyName || "B")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            marginTop: -35,
            marginBottom: 20,
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                backgroundColor: "#FFF",
                borderRadius: 16,
                padding: "16px 10px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: stat.color + "20",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 8px",
                  fontSize: 22,
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{ fontSize: 18, fontWeight: "bold", color: "#264653" }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#666",
                  marginTop: 2,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 32 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#264653",
              marginBottom: 16,
            }}
          >
            {t("Quick Actions")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12,
            }}
          >
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.route}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 12,
                    padding: 16,
                    textAlign: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      backgroundColor: action.color,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto 12px",
                      fontSize: 28,
                    }}
                  >
                    {action.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#264653",
                    }}
                  >
                    {action.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Requirements */}
        <div style={{ marginTop: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#264653" }}>
              {t("Recent Requirements")}
            </h2>
            <Link
              to="/fasalrath/buyer/requirements"
              style={{
                fontSize: 14,
                color: "#E76F51",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {t("See All")}
            </Link>
          </div>

          {recentRequirements.length > 0 ? (
            recentRequirements.map((req) => {
              const statusStyle = getStatusStyle(req.status);
              return (
                <Link
                  key={req._id}
                  to="/fasalrath/buyer/requirements"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FFF",
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 12,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: "#F0F4F8",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                        fontSize: 24,
                      }}
                    >
                      {getCategoryIcon(req.category)}
                    </div>
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#264653",
                        }}
                      >
                        {req.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#888",
                          marginTop: 2,
                          fontWeight: 500,
                        }}
                      >
                        {req.quantity} {req.unit} • ₹{req.targetPrice || "N/A"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        backgroundColor: statusStyle.bg,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: statusStyle.text,
                        }}
                      >
                        {statusStyle.label}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
              <div style={{ color: "#999", fontSize: 14 }}>
                {t("No requirements yet")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
