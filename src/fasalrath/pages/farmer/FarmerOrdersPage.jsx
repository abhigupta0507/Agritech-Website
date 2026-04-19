import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/farmer-orders.css";

const formatCurrency = (amount) => {
  if (amount === null || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FarmerOrdersPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const res = await authFetch(`${API_BASE_URL}/api/orders/farmer/list`);

      if (!res.ok) {
        throw new Error(t("Failed to fetch order history."));
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Order Fetch Error:", error.message);
      setError(error.message);
      setOrders([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "#2A9D8F";
      case "pending":
        return "#F4A261";
      case "rejected":
      case "cancelled":
        return "#E76F51";
      case "completed":
        return "#457B9D";
      default:
        return "#888";
    }
  };

  const getOrderTypeDetails = (type) => {
    if (type === "rental") {
      return { label: t("Rental"), icon: "🚚", color: "#E76F51" };
    }
    return { label: t("Purchase"), icon: "🛒", color: "#2A9D8F" };
  };

  if (loading) {
    return (
      <div className="fo-loading">
        <div className="fr-spinner fr-spinner-teal" />
        <p>{t("Loading Order History...")}</p>
      </div>
    );
  }

  return (
    <div className="fo-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("My Orders")}</span>
        </div>
        <div className="fr-page-title">📦 {t("My Orders")}</div>
        <div className="fr-page-subtitle">
          {t("Track the status of your purchases and rentals")} ({orders.length}{" "}
          {t("total")})
        </div>
      </div>

      {error && (
        <div className="fr-alert fr-alert-error">
          <span>⚠</span> {t("Error")}: {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="fo-empty">
          <div className="fo-empty-icon">📋</div>
          <div className="fo-empty-text">{t("No orders placed yet.")}</div>
        </div>
      ) : (
        <div className="fo-list">
          {orders.map((order) => {
            const typeDetails = getOrderTypeDetails(order.orderType);
            const statusColor = getStatusColor(order.status);
            const vendorName =
              order.vendor?.organizationName ||
              order.vendor?.name ||
              t("Unknown Vendor");
            const isRental = order.orderType === "rental";
            const totalDays = isRental ? order.rentalDuration?.totalDays : null;

            return (
              <div key={order._id} className="fo-card">
                <div className="fo-card-header">
                  <div className="fo-icon" style={{ color: typeDetails.color }}>
                    {typeDetails.icon}
                  </div>
                  <div className="fo-product-info">
                    <div className="fo-product-name">
                      {order.productSnapshot.name}
                    </div>
                    <div className="fo-vendor-name">
                      {typeDetails.label} {t("from")} {vendorName}
                    </div>
                  </div>
                  <div
                    className="fo-status-badge"
                    style={{ backgroundColor: statusColor }}
                  >
                    {t(order.status.toUpperCase())}
                  </div>
                </div>

                <div className="fo-card-body">
                  <div className="fo-detail-row">
                    <span className="fo-detail-label">{t("Total Amount")}</span>
                    <span className="fo-detail-value amount">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <div className="fo-detail-row">
                    <span className="fo-detail-label">{t("Quantity")}</span>
                    <span className="fo-detail-value">
                      {order.quantity} {order.productSnapshot.unit}
                    </span>
                  </div>

                  {isRental && order.rentalDuration && (
                    <>
                      <div className="fo-detail-row">
                        <span className="fo-detail-label">{t("Duration")}</span>
                        <span className="fo-detail-value">
                          {totalDays} {t("Days")}
                        </span>
                      </div>
                      <div className="fo-detail-row">
                        <span className="fo-detail-label">{t("Period")}</span>
                        <span className="fo-detail-value period">
                          {new Date(
                            order.rentalDuration.startDate,
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            order.rentalDuration.endDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="fo-card-footer">
                  <span className="fo-order-date">
                    {t("Ordered")}:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
