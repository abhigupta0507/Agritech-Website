// src/fasalrath/pages/buyer/RequirementOffersPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

const getStatusColor = (status) => {
  switch (status) {
    case "accepted":
      return "#2E7D32";
    case "rejected":
      return "#C62828";
    default:
      return "#F57C00";
  }
};

export default function RequirementOffersPage() {
  const navigate = useNavigate();
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const requirementId = searchParams.get("requirementId");
  const cropName = searchParams.get("cropName");

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/requirement-offers/requirement/${requirementId}`,
      );
      const data = await res.json();

      if (res.ok) {
        setOffers(data.offers);
      } else {
        alert(data.message || t("Could not fetch offers"));
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (requirementId) fetchOffers();
  }, [requirementId]);

  const handleAction = async (offerId, action) => {
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/requirement-offers/${offerId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setOffers((prev) =>
          prev.map((offer) =>
            offer._id === offerId ? { ...offer, status: action } : offer,
          ),
        );
        alert(t(`Offer marked as ${action}`));
      } else {
        alert(data.message || t("Action failed"));
      }
    } catch (error) {
      console.error(error);
      alert(t("Failed to update status"));
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "40px 0 20px",
          borderBottom: "1px solid #EEE",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginRight: 15,
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#1D3557",
              margin: 0,
            }}
          >
            {t("Received Offers")}
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            {t("For")}: {cropName || t("Requirement")}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <div className="fr-spinner" />
        </div>
      ) : (
        <div style={{ padding: "16px 0" }}>
          {offers.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <div style={{ fontSize: 60, marginBottom: 10 }}>📬</div>
              <div style={{ color: "#999", fontSize: 16 }}>
                {t("No offers received yet.")}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {offers.map((item) => (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "#E0E0E0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                          fontSize: 20,
                        }}
                      >
                        {item.farmer?.profileImage ? "👤" : "👨‍🌾"}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {item.farmer?.name || t("Unknown Farmer")}
                        </div>
                        <div
                          style={{ fontSize: 12, color: "#777", marginTop: 2 }}
                        >
                          📍 {item.farmer?.address || t("Location N/A")}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        backgroundColor: getStatusColor(item.status) + "20",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: 1,
                      backgroundColor: "#F0F0F0",
                      marginBottom: 12,
                    }}
                  />

                  {/* Details */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div
                        style={{ fontSize: 11, color: "#888", marginBottom: 2 }}
                      >
                        {t("Price Offered")}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#264653",
                        }}
                      >
                        ₹{item.pricePerUnit}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 1,
                        backgroundColor: "#F0F0F0",
                      }}
                    />
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div
                        style={{ fontSize: 11, color: "#888", marginBottom: 2 }}
                      >
                        {t("Quantity")}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#264653",
                        }}
                      >
                        {item.quantity} {t("units")}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 1,
                        backgroundColor: "#F0F0F0",
                      }}
                    />
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div
                        style={{ fontSize: 11, color: "#888", marginBottom: 2 }}
                      >
                        {t("Available")}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#264653",
                        }}
                      >
                        {new Date(item.availableDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {item.message && (
                    <div
                      style={{
                        backgroundColor: "#F1F8E9",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 15,
                      }}
                    >
                      <div
                        style={{
                          color: "#558B2F",
                          fontStyle: "italic",
                          fontSize: 13,
                        }}
                      >
                        "{item.message}"
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {item.status === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        onClick={() => handleAction(item._id, "rejected")}
                        style={{
                          flex: 0.48,
                          padding: "12px",
                          borderRadius: 8,
                          backgroundColor: "#FFEBEE",
                          border: "1px solid #FFCDD2",
                          color: "#C62828",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {t("Reject")}
                      </button>

                      <button
                        onClick={() => handleAction(item._id, "accepted")}
                        style={{
                          flex: 0.48,
                          padding: "12px",
                          borderRadius: 8,
                          backgroundColor: "#2E7D32",
                          border: "none",
                          color: "#FFF",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {t("Accept Offer")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
