// src/fasalrath/pages/buyer/BiddingPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

const TABS = ["All", "Winning", "Outbid", "Closed"];

export default function BuyerBiddingPage() {
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (buyer) {
      fetchBids();
    }
  }, [buyer]);

  const fetchBids = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await authFetch(`${API_BASE_URL}/api/bids/my/unique`);
      const data = await res.json();
      setBids(data.bids || []);
    } catch (err) {
      console.log("Error fetching bids", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchBids(true);
  };

  const filterByTab = (bid) => {
    if (activeTab === "All") return true;
    if (activeTab === "Winning") return bid.status === "active";
    if (activeTab === "Outbid") return bid.status === "outbid";
    if (activeTab === "Closed")
      return bid.status === "won" || bid.status === "lost";
    return false;
  };

  const filteredBids = bids.filter(filterByTab);

  const getStatusColor = (status) => {
    if (status === "active") return "#2A9D8F";
    if (status === "outbid") return "#E76F51";
    if (status === "won") return "#457B9D";
    return "#666";
  };

  const getStatusLabel = (status) => {
    if (status === "active") return t("Winning");
    if (status === "outbid") return t("Outbid");
    if (status === "won") return t("Won");
    return t("Lost");
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
      <div style={{ padding: "40px 0 16px" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#264653",
            margin: 0,
          }}
        >
          {t("My Bids")}
        </h1>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FFF",
          padding: "0 10px",
          borderBottom: "3px solid transparent",
        }}
      >
        {TABS.map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            style={{
              padding: "12px 10px",
              margin: "0 4px",
              borderBottom:
                activeTab === tabKey
                  ? "3px solid #E76F51"
                  : "3px solid transparent",
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              color: activeTab === tabKey ? "#E76F51" : "#666",
              cursor: "pointer",
            }}
          >
            {t(tabKey)}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <div className="fr-spinner" />
          </div>
        ) : filteredBids.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: 50,
              fontSize: 16,
              color: "#666",
            }}
          >
            {t("No bids found for")} "{t(activeTab)}"
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredBids.map((item) => {
              const sale = item.saleId;
              const crop = sale.cropId;

              return (
                <Link
                  key={item._id}
                  to={`/fasalrath/buyer/bidding-room/${sale._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      backgroundColor: "#FFF",
                      borderRadius: 12,
                      padding: 16,
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: "#FFF",
                          backgroundColor: "#606C38",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {t("Bid Placed")}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: getStatusColor(item.status),
                        }}
                      >
                        {getStatusLabel(item.status)}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#264653",
                        margin: "8px 0",
                      }}
                    >
                      {crop?.cropName || t("Unknown Crop")} ({sale?.quantity}{" "}
                      {sale?.unit})
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #F0F0F0",
                        paddingTop: 12,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#666",
                            marginBottom: 4,
                          }}
                        >
                          {t("Current Bid")}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: "#264653",
                          }}
                        >
                          ₹{sale?.currentHighestBid}
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#666",
                            marginBottom: 4,
                          }}
                        >
                          {t("My Bid")}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: getStatusColor(item.status),
                          }}
                        >
                          ₹{item.amount}
                        </div>
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
