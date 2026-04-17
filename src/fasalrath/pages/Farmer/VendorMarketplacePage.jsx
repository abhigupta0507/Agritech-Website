import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/vendor-marketplace.css";

const CATEGORY_TABS = [
  { label: "All", value: "all" },
  { label: "Rentals", value: "rentals" },
  { label: "Seeds", value: "seeds" },
  { label: "Agri Inputs", value: "agri-inputs" },
];

const formatCurrency = (amount) => {
  if (amount === null || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function VendorMarketplacePage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/product/all`);

      if (!res.ok) {
        throw new Error(t("Failed to fetch product list."));
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Product Fetch Error:", error.message);
      setError(error.message);
      setProducts([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    if (categoryFilter === "all") return products;
    return products.filter((p) => p.category === categoryFilter);
  };

  const filteredProducts = getFilteredProducts();

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQuantity("1");
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];
    setStartDate(today);
    setEndDate(tomorrow);
    setOrderError(null);
    setOrderSuccess(null);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedProduct(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !orderQuantity) {
      setOrderError(t("Missing product or quantity."));
      return;
    }
    if (selectedProduct.category === "rentals" && (!startDate || !endDate)) {
      setOrderError(t("Rental requires both start and end dates."));
      return;
    }

    setIsPlacingOrder(true);
    setOrderError(null);
    setOrderSuccess(null);

    const orderType =
      selectedProduct.category === "rentals" ? "rental" : "purchase";
    let body = {
      productId: selectedProduct._id,
      orderType: orderType,
      quantity: parseInt(orderQuantity),
    };

    if (orderType === "rental") {
      body = { ...body, startDate, endDate };
    }

    try {
      const res = await authFetch(`${API_BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t("Failed to place order."));
      }

      const data = await res.json();
      setOrderSuccess(
        t("Order placed successfully! Total: {{total}}", {
          total: formatCurrency(data.order.totalAmount),
        }),
      );

      setTimeout(() => {
        closeOrderModal();
        fetchProducts();
      }, 2000);
    } catch (err) {
      console.error("Order Error:", err.message);
      setOrderError(err.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "rentals":
        return "🚜";
      case "seeds":
        return "🌱";
      case "agri-inputs":
        return "🧪";
      default:
        return "🛒";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "rentals":
        return "#E76F51";
      case "seeds":
        return "#2A9D8F";
      case "agri-inputs":
        return "#F4A261";
      default:
        return "#457B9D";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "rentals":
        return t("Rental");
      case "seeds":
        return t("Seeds");
      case "agri-inputs":
        return t("Agri Input");
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="vm-loading">
        <div className="fr-spinner fr-spinner-teal" />
      </div>
    );
  }

  return (
    <div className="vm-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("Marketplace")}</span>
        </div>
        <div className="fr-page-title">🛒 {t("Vendor Marketplace")}</div>
        <div className="fr-page-subtitle">
          {t("Farm supplies and equipment")}
        </div>
      </div>

      <div className="vm-filter-container">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`vm-filter-btn ${categoryFilter === tab.value ? "active" : ""}`}
            onClick={() => setCategoryFilter(tab.value)}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {error && (
        <div className="fr-alert fr-alert-error">
          <span>⚠</span> {error}
        </div>
      )}

      {filteredProducts.length === 0 && !error ? (
        <div className="vm-empty">
          <div className="vm-empty-icon">🏪</div>
          <div className="vm-empty-text">
            {categoryFilter === "all"
              ? t("No products available")
              : t("No {{category}} products found", {
                  category: categoryFilter,
                })}
          </div>
          <div className="vm-empty-subtext">
            {t("Check back later for new listings")}
          </div>
        </div>
      ) : (
        <div className="vm-products-grid">
          {filteredProducts.map((product) => {
            const isRental = product.category === "rentals";
            const cardColor = getCategoryColor(product.category);

            return (
              <div
                key={product._id}
                className="vm-product-card"
                onClick={() => openOrderModal(product)}
              >
                <div className="vm-card-content">
                  <div
                    className="vm-icon-badge"
                    style={{ backgroundColor: cardColor + "15" }}
                  >
                    <span style={{ fontSize: 32 }}>
                      {getCategoryIcon(product.category)}
                    </span>
                  </div>

                  <div className="vm-product-info">
                    <div className="vm-product-header">
                      <div className="vm-product-name">{product.name}</div>
                      <div
                        className="vm-category-badge"
                        style={{
                          backgroundColor: cardColor + "20",
                          color: cardColor,
                        }}
                      >
                        {getCategoryLabel(product.category)}
                      </div>
                    </div>

                    <div className="vm-vendor-name">
                      🏪{" "}
                      {product.vendor?.organizationName ||
                        product.vendor?.name ||
                        t("Unknown Vendor")}
                    </div>

                    {product.description && (
                      <div className="vm-product-description">
                        {product.description}
                      </div>
                    )}

                    <div className="vm-bottom-row">
                      <div className="vm-price-section">
                        <div className="vm-price-label">
                          {isRental ? t("Per Day") : t("Price")}
                        </div>
                        <div
                          className="vm-price-value"
                          style={{ color: cardColor }}
                        >
                          {formatCurrency(product.price)}
                          <span className="vm-unit-text">/{product.unit}</span>
                        </div>
                      </div>

                      <div className="vm-stock-section">
                        <span>📦</span>
                        <span>
                          {product.stock} {product.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="vm-action-button"
                  style={{ backgroundColor: cardColor }}
                >
                  <span>{isRental ? t("Rent Now") : t("Buy Now")}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showOrderModal && selectedProduct && (
        <div className="vm-modal-overlay" onClick={closeOrderModal}>
          <div
            className="vm-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vm-modal-header">
              <div className="vm-modal-header-left">
                <div
                  className="vm-modal-icon"
                  style={{
                    backgroundColor:
                      getCategoryColor(selectedProduct.category) + "15",
                  }}
                >
                  <span style={{ fontSize: 24 }}>
                    {getCategoryIcon(selectedProduct.category)}
                  </span>
                </div>
                <div>
                  <div className="vm-modal-title">
                    {selectedProduct.category === "rentals"
                      ? t("Rent Equipment")
                      : t("Place Order")}
                  </div>
                  <div className="vm-modal-subtitle">
                    {selectedProduct.name}
                  </div>
                </div>
              </div>
              <button className="vm-modal-close" onClick={closeOrderModal}>
                ✕
              </button>
            </div>

            <div className="vm-modal-body">
              <div className="vm-product-summary-card">
                <div className="vm-summary-row">
                  <span className="vm-summary-label">{t("Vendor")}</span>
                  <span className="vm-summary-value">
                    {selectedProduct.vendor?.organizationName}
                  </span>
                </div>
                <div className="vm-summary-divider" />
                <div className="vm-summary-row">
                  <span className="vm-summary-label">
                    {selectedProduct.category === "rentals"
                      ? t("Rate per Day")
                      : t("Unit Price")}
                  </span>
                  <span
                    className="vm-summary-value"
                    style={{
                      color: getCategoryColor(selectedProduct.category),
                    }}
                  >
                    {formatCurrency(selectedProduct.price)}/
                    {selectedProduct.unit}
                  </span>
                </div>
                <div className="vm-summary-divider" />
                <div className="vm-summary-row">
                  <span className="vm-summary-label">
                    {t("Available Stock")}
                  </span>
                  <span className="vm-summary-value">
                    {selectedProduct.stock} {selectedProduct.unit}
                  </span>
                </div>
              </div>

              <div className="fr-form-group">
                <label className="fr-label">
                  {t("Quantity")} ({selectedProduct.unit})
                </label>
                <input
                  className="fr-input"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  type="number"
                  placeholder="1"
                />
              </div>

              {selectedProduct.category === "rentals" && (
                <div className="vm-rental-container">
                  <div className="vm-rental-header">
                    <span>📅</span>
                    <span
                      style={{
                        color: getCategoryColor(selectedProduct.category),
                      }}
                    >
                      {t("Rental Period")}
                    </span>
                  </div>

                  <div className="vm-date-row">
                    <div className="vm-date-input-wrapper">
                      <label className="fr-label">{t("Start Date")}</label>
                      <input
                        className="fr-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <span style={{ marginTop: 32 }}>→</span>

                    <div className="vm-date-input-wrapper">
                      <label className="fr-label">{t("End Date")}</label>
                      <input
                        className="fr-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {orderError && (
                <div className="fr-alert fr-alert-error">
                  <span>⚠</span> {orderError}
                </div>
              )}

              {orderSuccess && (
                <div className="fr-alert fr-alert-success">
                  <span>✓</span> {orderSuccess}
                </div>
              )}

              {!orderSuccess && (
                <button
                  className="fr-btn fr-btn-teal"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  style={{
                    backgroundColor: getCategoryColor(selectedProduct.category),
                  }}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="fr-spinner" /> {t("Placing Order...")}
                    </>
                  ) : selectedProduct.category === "rentals" ? (
                    t("Confirm Rental")
                  ) : (
                    t("Confirm Order")
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
