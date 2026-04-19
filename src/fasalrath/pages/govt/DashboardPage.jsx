// src/fasalrath/pages/govt/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function GovtDashboardPage() {
  const { employee, authFetch } = useGovtAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState(0);
  const [myRequests, setMyRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/quality/govt/pending`);
      if (res.ok) {
        const data = await res.json();
        setPendingRequests(data.requests?.length || 0);
      }

      const res2 = await authFetch(
        `${API_BASE_URL}/api/quality/govt/my-requests`
      );
      if (res2.ok) {
        const data = await res2.json();
        setMyRequests(data.requests?.length || 0);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: t("Approve Quality"),
      icon: "✅",
      route: "/fasalrath/govt/quality-grading",
    },
    {
      title: t("Enforce MSP"),
      icon: "🛡️",
      route: "/fasalrath/govt/msp-compliance",
    },
    {
      title: t("Manage Profile"),
      icon: "👤",
      route: "/fasalrath/govt/profile",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.greeting}>{t("Welcome")},</div>
          <div style={styles.userName}>{employee?.name || t("Officer")}</div>
          <div style={styles.department}>
            {employee?.department || t("Govt. of India")}
          </div>
        </div>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🏛️</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.sectionTitle}>{t("Overview")}</div>
      <div style={styles.statsContainer}>
        <div style={{ ...styles.statCard, borderColor: "#F4A261" }}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statValue}>{pendingRequests}</div>
          <div style={styles.statLabel}>{t("Pending Gradings")}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.sectionTitle}>{t("Actions")}</div>
      <div style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <div
            key={action.title}
            style={styles.actionCard}
            onClick={() => navigate(action.route)}
          >
            <div style={styles.actionIcon}>{action.icon}</div>
            <div style={styles.actionTitle}>{action.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    paddingBottom: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "30px",
  },
  greeting: {
    fontSize: "16px",
    color: "#666",
  },
  userName: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#264653",
    marginTop: "4px",
  },
  department: {
    fontSize: "14px",
    color: "#606C38",
    marginTop: "4px",
    fontWeight: "600",
  },
  logoContainer: {
    padding: "10px",
    backgroundColor: "#F8F9FA",
    borderRadius: "12px",
  },
  logoIcon: {
    fontSize: "50px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#264653",
    marginBottom: "16px",
    marginTop: "24px",
  },
  statsContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
    borderWidth: "2px",
    borderStyle: "solid",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  statIcon: {
    fontSize: "32px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#264653",
    marginTop: "8px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    transition: "all 0.2s",
  },
  actionIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },
  actionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#264653",
  },
};
