import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorDashboardPage() {
  const { t } = useTranslation();
  const { vendor, authFetch } = useVendorAuth();
  const navigate = useNavigate();
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/auth/my`);
      const data = await res.json();

      if (res.ok) {
        setRecentOrders(data.recentOrders || []);
        setTotalRevenue(data.stats?.monthlyRevenue || 0);
        setPendingOrders(data.stats?.pendingOrders || 0);
        setActiveOrders(data.stats?.activeOrders || 0);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#457B9D";
      case "pending":
        return "#F4A261";
      case "rejected":
        return "#E76F51";
      default:
        return "#666";
    }
  };

  const getStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return t("Completed");
      case "pending":
        return t("Pending");
      case "rejected":
        return t("Rejected");
      default:
        return status;
    }
  };

  const formatOrderId = (id) => {
    return `#${id.slice(-6).toUpperCase()}`;
  };

  const stats = [
    {
      label: t("Total Sales (Month)"),
      value: `₹${totalRevenue}`,
      icon: "💰",
    },
    {
      label: t("Pending Orders"),
      value: `${pendingOrders}`,
      icon: "📦",
    },
    {
      label: t("Active Orders"),
      value: `${activeOrders}`,
      icon: "🏃",
    },
  ];

  const quickActions = [
    {
      title: t("My Products"),
      icon: "🏪",
      color: "#2A9D8F",
      route: "/fasalrath/vendor/products",
    },
    {
      title: t("My Orders"),
      icon: "📦",
      color: "#457B9D",
      route: "/fasalrath/vendor/orders",
    },
    {
      title: t("Transactions"),
      icon: "💳",
      color: "#F4A261",
      route: "/fasalrath/vendor/transactions",
    },
    {
      title: t("Add New Product"),
      icon: "➕",
      color: "#E76F51",
      route: "/fasalrath/vendor/add-product",
    },
  ];

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <span>{t("Dashboard")}</span>
        </div>
        <div className="fr-page-title">
          {t("Welcome back")}, {vendor?.name || t("Vendor")}!
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 32 }}>
        {stats.map((stat, index) => (
          <div key={index} className="fr-card" style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fr-slate)", marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="fr-card" style={{ marginBottom: 32 }}>
        <div className="fr-card-header">
          <span className="fr-card-title">{t("Quick Actions")}</span>
        </div>
        <div className="fr-card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.route)}
                style={{
                  background: "white",
                  border: "2px solid var(--fr-border)",
                  borderRadius: 12,
                  padding: 20,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--fr-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{action.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fr-slate)" }}>
                  {action.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fr-card">
        <div className="fr-card-header">
          <span className="fr-card-title">{t("Recent Orders")}</span>
        </div>
        <div className="fr-card-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div className="fr-spinner" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    background: "var(--fr-off)",
                    borderRadius: 8,
                    border: "1px solid var(--fr-border)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fr-slate)", marginBottom: 4 }}>
                      {t("Order")} {formatOrderId(order._id)}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--fr-text-light)", marginBottom: 4 }}>
                      {order.productSnapshot?.name}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--fr-text-light)" }}>
                      {t("Qty:")} {order.quantity} | ₹{order.totalAmount}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: getStatusColor(order.status) }}>
                    {getStatus(order.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "var(--fr-text-light)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <div>{t("No recent orders")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
