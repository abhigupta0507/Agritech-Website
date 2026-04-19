// src/fasalrath/pages/farmer/FarmerListingDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";

export default function FarmerListingDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetTime = listing?.auctionStartTime || listing?.auctionStartDate;

    if (!listing || listing.status !== "pending" || !targetTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(targetTime).getTime();
      const distance = start - now;

      if (distance < 0) {
        setTimeLeft(t("Auction Starting..."));
        fetchListingDetails();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let timeString = "";
      if (days > 0) timeString += `${days}d `;
      timeString += `${hours.toString().padStart(2, "0")}h `;
      timeString += `${minutes.toString().padStart(2, "0")}m `;
      timeString += `${seconds.toString().padStart(2, "0")}s`;

      setTimeLeft(timeString);
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [listing, t]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const res = await authFetch(
        `${API_BASE_URL}/api/sales/marketplace/${id}`,
      );
      const data = await res.json();

      if (res.ok) {
        setListing(data.marketplaceSale);
      } else {
        alert(data.message || t("Failed to load listing"));
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchListingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <div className="fr-spinner" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <p>{t("Listing not found.")}</p>
      </div>
    );
  }

  const cropName = listing.cropId?.cropName || t("Unknown Crop");
  const quantity = `${listing.quantity} ${listing.unit}`;
  const isAuctionActive = listing.status === "active";
  const currentPrice =
    listing.totalBids > 0 ? listing.currentHighestBid : listing.minimumPrice;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "40px 0 16px",
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginRight: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#264653",
            margin: 0,
          }}
        >
          {t("My Listing Details")}
        </h1>
      </div>

      <button
        onClick={fetchListingDetails}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 10,
          marginLeft: "auto",
          padding: "8px 16px",
          background: "none",
          border: "1px solid #DDD",
          borderRadius: 8,
          color: "#264653",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span>🔄</span>
        {t("Refresh")}
      </button>

      <div
        style={{
          width: "100%",
          height: 200,
          backgroundColor: "#E8F5E9",
          borderRadius: 12,
          marginTop: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 64,
        }}
      >
        🌱
      </div>

      <div style={{ padding: "20px 0" }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#264653",
            marginBottom: 24,
          }}
        >
          {cropName}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#F8F9FA",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
              {t("Quantity")}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#264653" }}>
              {quantity}
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
              {listing.totalBids > 0
                ? t("Current Highest Bid")
                : t("Starting Price")}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#2A9D8F" }}>
              ₹{currentPrice}
            </div>
          </div>
        </div>

        {listing.hasQualityCertificate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FFF8E1",
              padding: 12,
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 24, marginRight: 10 }}>🏆</span>
            <div style={{ color: "#F9A825", fontWeight: "bold" }}>
              {t("Quality Certified: Grade")} {listing.qualityGrade}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          {isAuctionActive ? (
            <button
              onClick={() =>
                navigate(`/fasalrath/farmer/bidding-room/${listing._id}`)
              }
              style={{
                width: "100%",
                padding: 16,
                backgroundColor: "#E76F51",
                border: "none",
                borderRadius: 12,
                color: "#FFF",
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {t("Watch Live Auction")}
            </button>
          ) : (
            <div
              style={{
                padding: 20,
                backgroundColor: "#ECEFF1",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: 16, fontWeight: "bold", color: "#37474F" }}
              >
                {t("Status:")} {t(listing.status).toUpperCase()}
              </div>

              {listing.status === "sold" && (
                <div style={{ marginTop: 6, fontSize: 14, color: "#607D8B" }}>
                  {t("This listing has been sold.")}
                </div>
              )}
              {listing.status === "unsold" && (
                <div style={{ marginTop: 6, fontSize: 14, color: "#607D8B" }}>
                  {t("Auction ended with no bids.")}
                </div>
              )}
              {listing.status === "cancelled" && (
                <div style={{ marginTop: 6, fontSize: 14, color: "#607D8B" }}>
                  {t("You cancelled this listing.")}
                </div>
              )}

              {listing.status === "pending" && (
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{ fontSize: 14, color: "#607D8B", marginBottom: 8 }}
                  >
                    {t("Auction starts in:")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>🕐</span>
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#E76F51",
                      }}
                    >
                      {timeLeft || "N/A"}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    {new Date(
                      listing.auctionStartTime || listing.auctionStartDate,
                    ).toLocaleString() || "N/A"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
