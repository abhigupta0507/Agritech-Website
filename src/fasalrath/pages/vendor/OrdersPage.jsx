import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorOrdersPage() {
  const { t } = useTranslation();
  const { authFetch } = useVendorAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");

  const TABS = ["Pending", "Active", "Completed", "Declined"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/orders/vendor/list`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error(error);
      alert(t("Could not fetch orders"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/orders/vendor/update-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, status: newStatus }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(`${t("Order")} ${getStatus(newStatus)}!`);
        fetchOrders();
      } else {
        alert(data.message || t("Could not update status"));
      }
    } catch (error) {
      alert(t("Network error"));
    } finally {
      setActionLoading(null);
    }
  };

  const getFilteredOrders = () => {
    return orders.filter((order) => {
      const status = order.status;
      switch (activeTab) {
        case "Pending":
          return status === "pending";
        case "Active":
          return status === "accepted";
        case "Completed":
          return status === "completed";
        case "Declined":
          return status === "rejected" || status === "cancelled";
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "#F4A261";
    if (status === "accepted") return "#457B9D";
    if (status === "completed") return "#264653";
    return "#E76F51";
  };

  const getStatus = (status) => {
    if (status === "pending") return t("Pending");
    if (status === "accepted") return t("Accepted");
    if (status === "completed") return t("Completed");
    if (status === "rejected" || status === "cancelled") return t("Rejected");
    return status || t("Unknown");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <span>{t("Orders")}</span>
        </div>
        <div className="fr-page-title">📦 {t("Manage Orders")}</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "2px solid var(--fr-border)" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? "3px solid #457B9D" : "3px solid transparent",
              color: activeTab === tab ? "#457B9D" : "var(--fr-text-light)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "var(--fr-font-body)",
            }}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="fr-spinner" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredOrders.map((item) => {
            const isRental = item.orderType === "rental";
            const isPending = item.status === "pending";

            return (
              <div key={item._id} className="fr-card">
                <div className="fr-card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--fr-border)" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fr-slate)" }}>
                      {item.productSnapshot?.name || item.product?.name || t("Unknown Item")}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: getStatusColor(item.status), textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {getStatus(item.status)}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>👤</span>
                      <span style={{ fontSize: 14, color: "var(--fr-text)" }}>
                        {t("Buyer:")} {item.buyer?.contactPerson || item.buyer?.companyName || t("Unknown")}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>📱</span>
                      <a
                        href={`tel:${item.buyer?.phone}`}
                        style={{ fontSize: 14, color: "#457B9D", textDecoration: "none", fontWeight: 600 }}
                      >
                        {t("Phone:")} {item.buyer?.phone || t("Unknown")}
                      </a>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{isRental ? "📅" : "📦"}</span>
                      <span style={{ fontSize: 14, color: "var(--fr-text)" }}>
                        {isRental
                          ? `${formatDate(item.rentalDuration?.startDate)} - ${formatDate(item.rentalDuration?.endDate)} (${item.rentalDuration?.totalDays} ${t("Days")})`
                          : `${t("Quantity:")} ${item.quantity} ${item.productSnapshot?.unit || t("units")}`}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>💰</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#457B9D" }}>
                        {t("Total")}: ₹{item.totalAmount}
                      </span>
                    </div>
                  </div>

                  {isPending && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 16, borderTop: "1px solid var(--fr-border)" }}>
                      {actionLoading === item._id ? (
                        <div className="fr-spinner" style={{ width: 20, height: 20 }} />
                      ) : (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item._id, "rejected")}
                            className="fr-btn fr-btn-ghost"
                            style={{ color: "#E76F51", borderColor: "#E76F51" }}
                          >
                            {t("Decline")}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item._id, "accepted")}
                            className="fr-btn"
                            style={{ background: "#2A9D8F", color: "white" }}
                          >
                            {t("Accept")}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === "Active" && (
                    <div style={{ paddingTop: 16, borderTop: "1px solid var(--fr-border)" }}>
                      <button
                        onClick={() => handleUpdateStatus(item._id, "completed")}
                        className="fr-btn"
                        style={{ background: "#264653", color: "white", width: "100%" }}
                      >
                        {t("Mark Completed")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="fr-card">
          <div className="fr-card-body" style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <div style={{ fontSize: 18, color: "var(--fr-text-light)" }}>
              {t("No orders found.")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
