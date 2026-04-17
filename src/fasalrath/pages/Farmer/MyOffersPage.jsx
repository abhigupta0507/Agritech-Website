import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/my-offers.css";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyOffersPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setRefreshing(true);

    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/requirement-offers/my-offers`,
      );

      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      } else {
        alert(t("Failed to load offers"));
      }
    } catch (error) {
      console.error("Fetch Offers Error:", error);
      alert(t("Network error occurred"));
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const getFilteredOffers = () => {
    if (filter === "all") return offers;
    return offers.filter((o) => o.status === filter);
  };

  const filteredOffers = getFilteredOffers();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#F4A261";
      case "accepted":
        return "#4CAF50";
      case "rejected":
        return "#E76F51";
      case "cancelled":
        return "#999";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return t("Pending");
      case "accepted":
        return t("Accepted");
      case "rejected":
        return t("Rejected");
      case "cancelled":
        return t("Cancelled");
      default:
        return status;
    }
  };

  const handleCancelOffer = async (offerId) => {
    if (!window.confirm(t("Are you sure you want to cancel this offer?")))
      return;

    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/requirement-offers/${offerId}/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert(t("Offer cancelled successfully"));
        fetchOffers();
      } else {
        alert(data.message || t("Failed to cancel offer"));
      }
    } catch (error) {
      console.error("Cancel Offer Error:", error);
      alert(t("Network error occurred"));
    }
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) window.location.href = `tel:${phoneNumber}`;
  };

  if (loading) {
    return (
      <div className="mo-loading">
        <div className="fr-spinner fr-spinner-teal" />
      </div>
    );
  }

  return (
    <div className="mo-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("My Offers")}</span>
        </div>
        <div className="fr-page-title">🤝 {t("My Offers")}</div>
        <div className="fr-page-subtitle">
          {t("Track your submitted offers")}
        </div>
      </div>

      <div className="mo-filter-container">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`mo-filter-btn ${filter === tab.value ? "active" : ""}`}
            onClick={() => setFilter(tab.value)}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      <div className="mo-stats-container">
        <div className="mo-stat-card">
          <div className="mo-stat-value">{filteredOffers.length}</div>
          <div className="mo-stat-label">{t("Total")}</div>
        </div>
        <div className="mo-stat-card">
          <div className="mo-stat-value" style={{ color: "#F4A261" }}>
            {offers.filter((o) => o.status === "pending").length}
          </div>
          <div className="mo-stat-label">{t("Pending")}</div>
        </div>
        <div className="mo-stat-card">
          <div className="mo-stat-value" style={{ color: "#4CAF50" }}>
            {offers.filter((o) => o.status === "accepted").length}
          </div>
          <div className="mo-stat-label">{t("Accepted")}</div>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="mo-empty">
          <div className="mo-empty-icon">📧</div>
          <div className="mo-empty-text">
            {filter === "all"
              ? t("No offers submitted yet")
              : t("No {{status}} offers found", { status: filter })}
          </div>
          <div className="mo-empty-subtext">
            {t("Browse buyer requirements and submit offers")}
          </div>
        </div>
      ) : (
        <div className="mo-list">
          {filteredOffers.map((offer) => {
            const requirement = offer.requirement || {};
            const buyer = offer.buyer || {};
            const isAccepted = offer.status === "accepted";
            const isPending = offer.status === "pending";
            const isRejected = offer.status === "rejected";
            const isCancelled = offer.status === "cancelled";

            return (
              <div key={offer._id} className="mo-card">
                <div className="mo-card-header">
                  <div className="mo-card-title">
                    <div className="mo-crop-icon">🌱</div>
                    <div className="mo-title-text">
                      <div className="mo-crop-name">{requirement.cropName}</div>
                      <div className="mo-category-text">
                        {requirement.category}
                      </div>
                    </div>
                  </div>
                  <div
                    className="mo-status-badge"
                    style={{ backgroundColor: getStatusColor(offer.status) }}
                  >
                    {getStatusText(offer.status)}
                  </div>
                </div>

                <div className="mo-card-details">
                  <div className="mo-detail-row">
                    <span>⚖️</span>
                    <span>
                      {offer.quantity} {requirement.unit} {t("offered")}
                    </span>
                  </div>
                  <div className="mo-detail-row">
                    <span>💰</span>
                    <span>
                      ₹{offer.pricePerUnit}/{requirement.unit}
                    </span>
                  </div>
                  <div className="mo-detail-row">
                    <span>📅</span>
                    <span>
                      {t("Available")}:{" "}
                      {new Date(offer.availableDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mo-buyer-container">
                  <div className="mo-buyer-header">{t("BUYER")}</div>
                  <div className="mo-buyer-row">
                    <div className="mo-buyer-avatar">💼</div>
                    <div style={{ flex: 1 }}>
                      <div className="mo-buyer-name">
                        {buyer.companyName || t("Unknown Buyer")}
                      </div>
                      <div className="mo-buyer-phone">
                        📞 {buyer.phone || t("No phone")}
                      </div>
                    </div>
                    {buyer.phone && (
                      <button
                        className="mo-call-button"
                        onClick={() => handleCall(buyer.phone)}
                      >
                        📞
                      </button>
                    )}
                  </div>
                </div>

                {offer.message && (
                  <div className="mo-message-container">
                    <span>💬</span>
                    <span>{offer.message}</span>
                  </div>
                )}

                {isPending && (
                  <>
                    <div className="mo-pending-info">
                      <span>⏳</span>
                      <span>{t("Waiting for buyer response...")}</span>
                    </div>
                    <button
                      className="mo-cancel-button"
                      onClick={() => handleCancelOffer(offer._id)}
                    >
                      ❌ {t("Cancel Offer")}
                    </button>
                  </>
                )}

                {isAccepted && (
                  <div className="mo-accepted-info">
                    <span>✓</span>
                    <span>{t("Offer accepted! Contact buyer to proceed")}</span>
                  </div>
                )}

                {isRejected && (
                  <div className="mo-rejected-info">
                    <span>✕</span>
                    <span>{t("Offer was not accepted by buyer")}</span>
                  </div>
                )}

                {isCancelled && (
                  <div className="mo-cancelled-info">
                    <span>⊘</span>
                    <span>{t("You cancelled this offer")}</span>
                  </div>
                )}

                <div className="mo-card-footer">
                  {t("Submitted")}:{" "}
                  {new Date(offer.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
