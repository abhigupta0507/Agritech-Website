// src/fasalrath/pages/buyer/RequirementsPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

const TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Expired", value: "expired" },
];

export default function BuyerRequirementsPage() {
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchRequirements = async () => {
    if (!buyer) return;
    setRefreshing(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/buyer/requirements`);
      const data = await res.json();

      if (res.ok) {
        setRequirements(data.requirements || []);
      } else {
        console.log("Failed to load requirements");
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const filteredRequirements = useMemo(() => {
    if (activeTab === "all") return requirements;
    if (activeTab === "expired") {
      return requirements.filter((r) =>
        ["expired", "cancelled"].includes(r.status),
      );
    }
    return requirements.filter((r) => r.status === activeTab.toLowerCase());
  }, [requirements, activeTab]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#2A9D8F";
      case "fulfilled":
        return "#4CAF50";
      case "expired":
        return "#E76F51";
      case "cancelled":
        return "#999";
      default:
        return "#666";
    }
  };

  const getContractLabel = (type) => {
    if (type === "pre_harvest_contract") return t("Pre-Harvest");
    if (type === "spot_market") return t("Spot Market");
    return t("Contract");
  };

  const getContractColor = (type) => {
    if (type === "pre_harvest_contract") return "#9C27B0";
    return "#F4A261";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <div className="fr-spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "40px 0 16px",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#264653",
              margin: 0,
            }}
          >
            {t("My Requirements")}
          </h1>
          <p style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
            {t("Manage your crop needs and contracts")}
          </p>
        </div>
        <Link to="/fasalrath/buyer/post-requirement">
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#E76F51",
              border: "none",
              color: "#FFF",
              fontSize: 24,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            +
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 0",
          borderBottom: "1px solid #E0E0E0",
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              backgroundColor: activeTab === tab.value ? "#2A9D8F" : "#F0F0F0",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === tab.value ? "#FFF" : "#666",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "20px 0",
          backgroundColor: "#F8F9FA",
          margin: "0 -20px",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFF",
            padding: 16,
            borderRadius: 12,
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#264653" }}>
            {filteredRequirements.length}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {t("Total")}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFF",
            padding: 16,
            borderRadius: 12,
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#2A9D8F" }}>
            {requirements.filter((r) => r.status === "active").length}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {t("Active")}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#FFF",
            padding: 16,
            borderRadius: 12,
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#4CAF50" }}>
            {requirements.filter((r) => r.status === "fulfilled").length}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {t("Fulfilled")}
          </div>
        </div>
      </div>

      {/* Requirements List */}
      <div style={{ marginTop: 20 }}>
        {filteredRequirements.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#666",
                marginBottom: 8,
              }}
            >
              {activeTab === "all"
                ? t("No requirements yet")
                : t("No {{status}} requirements found", { status: activeTab })}
            </div>
            <div style={{ fontSize: 14, color: "#888" }}>
              {t("Post a requirement to start receiving offers from farmers")}
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredRequirements.map((item) => {
              const isFulfilled = item.status === "fulfilled";
              const farmer = item.fulfilledBy || {};

              return (
                <Link
                  key={item._id}
                  to={`/fasalrath/buyer/edit-requirement/${item._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                      cursor: "pointer",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <div style={{ fontSize: 24, marginRight: 12 }}>
                          {isFulfilled ? "✅" : "🌱"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "#264653",
                              marginBottom: 4,
                            }}
                          >
                            {item.cropName}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                padding: "3px 8px",
                                borderRadius: 6,
                                backgroundColor:
                                  getContractColor(item.contractType) + "15",
                                fontSize: 11,
                                fontWeight: 600,
                                color: getContractColor(item.contractType),
                              }}
                            >
                              {getContractLabel(item.contractType)}
                            </div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                              {item.category}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "5px 10px",
                          borderRadius: 12,
                          backgroundColor: getStatusColor(item.status),
                          color: "#FFF",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {t(item.status?.toUpperCase())}
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        <span style={{ marginRight: 6 }}>⚖️</span>
                        {item.quantity} {item.unit}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        <span style={{ marginRight: 6 }}>₹</span>₹
                        {item.targetPrice}/{item.unit}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        <span style={{ marginRight: 6 }}>📅</span>
                        {new Date(item.requiredByDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Fulfilled By */}
                    {isFulfilled && item.fulfilledBy && (
                      <div
                        style={{
                          backgroundColor: "#F0F9FF",
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 12,
                          border: "1px solid #E0F2FE",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#457B9D",
                              letterSpacing: 0.5,
                            }}
                          >
                            {t("FULFILLED BY")}
                          </div>
                          {farmer.isVerified && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#2A9D8F",
                                padding: "2px 6px",
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#FFF",
                              }}
                            >
                              ✓ {t("Verified")}
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              backgroundColor: "#457B9D",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: 10,
                              color: "#FFF",
                              fontWeight: "bold",
                              fontSize: 16,
                            }}
                          >
                            {farmer.name
                              ? farmer.name.charAt(0).toUpperCase()
                              : "F"}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: "#1D3557",
                              }}
                            >
                              {farmer.name || t("Unknown Farmer")}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#64748B",
                                marginTop: 2,
                              }}
                            >
                              📍 {farmer.address || t("No address")}
                            </div>
                          </div>

                          <button
                            style={{
                              backgroundColor: "#457B9D",
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              border: "none",
                              color: "#FFF",
                              fontSize: 18,
                              cursor: "pointer",
                              marginLeft: 8,
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              if (farmer.phone)
                                window.open(`tel:${farmer.phone}`);
                            }}
                          >
                            📞
                          </button>
                        </div>
                      </div>
                    )}

                    {/* View Offers */}
                    <div
                      style={{
                        paddingTop: 12,
                        borderTop: "1px solid #F0F0F0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#F8F9FA",
                          padding: 12,
                          borderRadius: 8,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/fasalrath/buyer/requirement-offers?requirementId=${item._id}&cropName=${item.cropName}`;
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>📧</span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#457B9D",
                            }}
                          >
                            {item.totalOffersReceived || 0}{" "}
                            {t("Offers Received")}
                          </span>
                        </div>
                        <span style={{ fontSize: 20, color: "#457B9D" }}>
                          ›
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
