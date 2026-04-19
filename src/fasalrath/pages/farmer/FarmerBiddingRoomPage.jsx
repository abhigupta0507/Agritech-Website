// src/fasalrath/pages/farmer/FarmerBiddingRoomPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";

export default function FarmerBiddingRoomPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [saleInfo, setSaleInfo] = useState(null);
  const [bids, setBids] = useState([]);
  const [currentHighest, setCurrentHighest] = useState(0);
  const [auctionEndDate, setAuctionEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const socketRef = useRef(null);

  const flashNewBid = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);
  };

  const fetchBids = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/bids/${id}`);
      const data = await res.json();

      if (res.ok) {
        setBids(data.bids?.bids || []);
        setCurrentHighest(data.bids?.currentHighestBid || 0);
        setAuctionEndDate(data.bids?.auctionEndDate);
      } else {
        alert(data.message || t("Failed to load bids"));
      }
    } catch (err) {
      console.error(err);
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchSaleInfo = async () => {
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/sales/marketplace/${id}`,
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || t("Failed to load sale info"));
        return;
      }

      const sale = data.marketplaceSale;
      setSaleInfo(sale);
      setAuctionEndDate(sale.auctionEndDate);
      setCurrentHighest(sale.currentHighestBid || sale.minimumPrice);
    } catch (err) {
      console.error(err);
      alert(t("Failed to load sale details"));
    }
  };

  useEffect(() => {
    // Get the farmer token directly from localStorage based on your auth context setup
    const token = localStorage.getItem("fr_access_token");

    socketRef.current = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    socketRef.current.emit("join-sale-room", id);

    socketRef.current.on("new-bid", (payload) => {
      if (payload.saleId === id) {
        setBids((prev) => [payload.bid, ...prev]);
        setCurrentHighest(payload.currentHighestBid);
        flashNewBid();
      }
    });

    socketRef.current.on("auction-ended", (data) => {
      setIsAuctionEnded(true);
      const msg =
        data.status === "sold"
          ? `${t("Sold for")} ₹${data.finalPrice}!`
          : t("No bids received");
      alert(`${t("Auction Ended")}\n${msg}`);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-sale-room", id);
        socketRef.current.disconnect();
      }
    };
  }, [id, t]);

  useEffect(() => {
    fetchSaleInfo();
    fetchBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!auctionEndDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auctionEndDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(t("Auction Ended"));
        setIsAuctionEnded(true);
        clearInterval(timer);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndDate, t]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <div className="fr-spinner" />
        <p style={{ marginTop: 12, color: "#666" }}>
          {t("Loading live feed...")}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "0 20px 40px",
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 0 16px",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginRight: 16,
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#264653",
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
            {t("Live Auction Dashboard")}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: 12, color: "#666" }}>
            {isConnected ? "Live" : "Offline"}
          </span>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: isConnected ? "#2A9D8F" : "#E76F51",
            }}
          />
        </div>
      </div>

      {/* CROP INFO CARD */}
      {saleInfo && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: 20,
            borderRadius: 16,
            marginTop: 20,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <span style={{ fontSize: 28, marginRight: 10 }}>🌱</span>
            <h2
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#264653",
                margin: 0,
              }}
            >
              {saleInfo.cropId?.cropName || t("Unknown Crop")}
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#777" }}>{t("Quantity")}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#264653" }}>
                {saleInfo.quantity} {saleInfo.unit}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#777" }}>
                {t("Starting Price")}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#264653" }}>
                ₹{saleInfo.minimumPrice?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE AUCTION STATUS CARD */}
      <div
        style={{
          margin: "20px 0",
          padding: "30px 20px",
          backgroundColor: isFlashing ? "#FFF4E6" : "#FFFFFF",
          transition: "background-color 0.5s ease",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#F0F9FF",
            padding: "8px 16px",
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 20, marginRight: 8 }}>⏳</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isAuctionEnded ? "#E76F51" : "#2A9D8F",
            }}
          >
            {timeLeft}
          </span>
        </div>

        <div>
          <div
            style={{
              fontSize: 14,
              color: "#666",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            {t("Current Highest Bid")}
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#2A9D8F",
              marginBottom: 4,
            }}
          >
            ₹{currentHighest.toLocaleString()}
          </div>
          <div style={{ fontSize: 14, color: "#999" }}>
            {bids.length} {bids.length === 1 ? t("bid") : t("bids")}{" "}
            {t("placed")}
          </div>
        </div>
      </div>

      {/* BID HISTORY */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#264653",
            margin: "0 0 16px",
          }}
        >
          {t("Live Bidding Activity")} ({bids.length})
        </h3>

        {bids.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👀</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#999" }}>
              {t("Waiting for bids...")}
            </div>
            <div style={{ fontSize: 14, color: "#BBB", marginTop: 4 }}>
              {t("No buyers have placed a bid yet.")}
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 8 }}>
            {bids.map((item, index) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  marginBottom: 10,
                  borderRadius: 12,
                  backgroundColor: index === 0 ? "#FFF9E6" : "#F8F9FA",
                  border:
                    index === 0 ? "2px solid #FFD700" : "1px solid #E0E0E0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {index === 0 && (
                    <span style={{ fontSize: 20, marginRight: 10 }}>👑</span>
                  )}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#264653",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                      color: "#FFF",
                      fontWeight: "bold",
                      fontSize: 18,
                    }}
                  >
                    {item.buyerId?.companyName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#264653",
                      }}
                    >
                      {item.buyerId?.companyName || t("Anonymous Buyer")}
                    </div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                      {new Date(item.bidTime).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div
                  style={{ fontSize: 18, fontWeight: "bold", color: "#E76F51" }}
                >
                  ₹{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
