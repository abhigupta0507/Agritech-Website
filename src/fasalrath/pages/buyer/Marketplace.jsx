// src/fasalrath/pages/buyer/MarketplacePage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

export default function BuyerMarketplacePage() {
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    if (!buyer) return;
    setLoading(true);

    try {
      const res = await authFetch(`${API_BASE_URL}/api/sales/marketplace`);
      const data = await res.json();

      if (res.ok) {
        setListings(data.marketplaceSales || []);
      } else {
        console.log("Fetch message:", data.message);
        setListings([]);
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error fetching marketplace listings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
      <div
        style={{
          padding: "40px 0 20px",
          borderBottom: "1px solid #F0F0F0",
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#264653",
            margin: 0,
          }}
        >
          {t("Post-Harvest Marketplace")}
        </h1>
        <p style={{ fontSize: 15, color: "#666", marginTop: 4 }}>
          {t("Browse verified harvests from farmers")}
        </p>
      </div>

      {loading && listings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 50 }}>
          <div className="fr-spinner" />
        </div>
      ) : (
        <div>
          {listings.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🧺</div>
              <div style={{ fontSize: 16, color: "#999" }}>
                {t("No crops listed for sale right now.")}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {listings.map((item) => {
                const cropName = item.cropId?.cropName || t("Unknown Crop");
                const farmerName = item.farmerId?.name || t("Ravi");
                const farmerLocation =
                  item.farmerId?.address || t("Location N/A");
                const quantity = `${item.quantity} ${item.unit}`;
                const price = item.minimumPrice
                  ? `₹${item.minimumPrice}`
                  : t("Open to Bids");

                const harvestDate = new Date(
                  item.harvestDate,
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                const qualityGrade = item.qualityGrade;
                const hasQualityCert = item.hasQualityCertificate;

                return (
                  <Link
                    key={item._id}
                    to={`/fasalrath/buyer/listing-details/${item._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        backgroundColor: "#FFF",
                        borderRadius: 12,
                        padding: 16,
                        display: "flex",
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
                          width: 80,
                          height: 80,
                          borderRadius: 8,
                          backgroundColor: "#E8F5E9",
                          marginRight: 16,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: 32,
                        }}
                      >
                        🌱
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "#264653",
                              marginRight: 8,
                            }}
                          >
                            {cropName}
                          </div>
                          {hasQualityCert && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#E9C46A",
                                paddingLeft: 6,
                                paddingRight: 6,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: "bold",
                                color: "#FFF",
                              }}
                            >
                              ✓ {t("Grade")} {qualityGrade}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#2A9D8F",
                            marginBottom: 8,
                          }}
                        >
                          {t("Base Price")}: {price}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                            fontSize: 13,
                            color: "#555",
                          }}
                        >
                          <span style={{ marginRight: 6 }}>⚖️</span>
                          {quantity}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                            fontSize: 13,
                            color: "#555",
                          }}
                        >
                          <span style={{ marginRight: 6 }}>📅</span>
                          {t("Harvested")}: {harvestDate}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                            fontSize: 13,
                            color: "#555",
                          }}
                        >
                          <span style={{ marginRight: 6 }}>📍</span>
                          {farmerLocation}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 13,
                            color: "#555",
                          }}
                        >
                          <span style={{ marginRight: 6 }}>👤</span>
                          {farmerName}
                        </div>
                      </div>

                      <div
                        style={{
                          alignSelf: "center",
                          fontSize: 24,
                          color: "#CCC",
                        }}
                      >
                        ›
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
