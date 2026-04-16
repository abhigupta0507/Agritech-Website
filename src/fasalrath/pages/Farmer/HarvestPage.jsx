import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/harvest.css";

export default function HarvestPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cropOutputs, setCropOutputs] = useState([]);
  const [filter, setFilter] = useState("all");

  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [saleType, setSaleType] = useState(null);
  const [minimumPrice, setMinimumPrice] = useState("");
  const [mspData, setMspData] = useState(null);
  const [loadingMSP, setLoadingMSP] = useState(false);

  useEffect(() => {
    fetchOutputs();
  }, []);

  const fetchOutputs = async () => {
    setRefreshing(true);
    try {
      const url = `${API_BASE_URL}/api/crop-output/my-outputs`;
      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        setCropOutputs(data.outputs || []);
      }
    } catch (error) {
      console.error("Fetch Outputs Error:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const getFilteredOutputs = () => {
    if (filter === "all") return cropOutputs;
    if (filter === "quality-pending")
      return cropOutputs.filter((o) => o.qualityStatus === "pending");
    if (filter === "quality-approved")
      return cropOutputs.filter((o) => o.qualityStatus === "approved");
    if (filter === "quality-rejected")
      return cropOutputs.filter((o) => o.qualityStatus === "rejected");
    return cropOutputs.filter((o) => o.status === filter);
  };

  const filteredOutputs = getFilteredOutputs();

  const getQualityStatusColor = (qualityStatus) => {
    const colorMap = {
      "not-requested": "#888",
      pending: "#F4A261",
      approved: "#4CAF50",
      rejected: "#E76F51",
    };
    return colorMap[qualityStatus] || "#666";
  };

  const getSaleStatusColor = (status) => {
    const colorMap = {
      available: "#2A9D8F",
      "listed-for-sale": "#457B9D",
      sold: "#888",
      reserved: "#9C27B0",
    };
    return colorMap[status] || "#666";
  };

  const getQualityStatusText = (qualityStatus) => {
    const statusMap = {
      "not-requested": t("No Check"),
      pending: t("Pending"),
      approved: t("Certified"),
      rejected: t("Rejected"),
    };
    return statusMap[qualityStatus] || qualityStatus;
  };

  const getSaleStatusText = (status) => {
    const statusMap = {
      available: t("Available"),
      "listed-for-sale": t("Listed"),
      sold: t("Sold"),
      reserved: t("Reserved"),
    };
    return statusMap[status] || status;
  };

  const handleRequestQuality = async (output) => {
    if (
      !window.confirm(
        t(
          "Submit quality inspection request for {{quantity}} {{unit}} of {{crop}}?",
          {
            quantity: output.quantity,
            unit: output.unit,
            crop: output.cropId?.cropName,
          },
        ),
      )
    )
      return;

    try {
      const res = await authFetch(`${API_BASE_URL}/api/quality/farmer/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropOutputId: output._id,
          storageLocation: output.storageLocation || t("Farm Storage"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("Quality inspection request submitted successfully!"));
        fetchOutputs();
      } else {
        alert(data.message || t("Failed to create request"));
      }
    } catch (error) {
      console.error("Submit Request Error:", error);
      alert(t("Network error occurred"));
    }
  };

  const handleViewCertificate = (output) => {
    if (output.qualityRequestId) {
      navigate("/fasalrath/quality");
    }
  };

  const fetchMSP = async (cropId) => {
    setLoadingMSP(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/sales/msp/${cropId}`);
      const data = await res.json();

      if (res.ok && data.hasMSP) {
        setMspData(data.msp);
      } else {
        setMspData(null);
      }
    } catch (error) {
      console.error("Fetch MSP Error:", error);
      setMspData(null);
    } finally {
      setLoadingMSP(false);
    }
  };

  const openSaleModal = async (output, type) => {
    setSelectedOutput(output);
    setSaleType(type);
    setMinimumPrice("");

    if (type === "msp") {
      await fetchMSP(output.cropId._id);
    }

    setShowSaleModal(true);
  };

  const closeSaleModal = () => {
    setShowSaleModal(false);
    setSelectedOutput(null);
    setSaleType(null);
    setMinimumPrice("");
    setMspData(null);
  };

  const handleListForMarketplace = async (e) => {
    e.preventDefault();
    if (!minimumPrice || parseFloat(minimumPrice) <= 0) {
      alert(t("Please enter a valid minimum price"));
      return;
    }

    try {
      const res = await authFetch(`${API_BASE_URL}/api/sales/marketplace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropOutputId: selectedOutput._id,
          minimumPrice: parseFloat(minimumPrice),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("Your crop has been listed on the marketplace!"));
        closeSaleModal();
        fetchOutputs();
      } else {
        alert(data.message || t("Failed to list crop"));
      }
    } catch (error) {
      console.error("List Marketplace Error:", error);
      alert(t("Network error occurred"));
    }
  };

  const handleListForMSP = async () => {
    if (!mspData) {
      alert(t("MSP data not available"));
      return;
    }

    const totalAmount = mspData.price * selectedOutput.quantity;

    if (
      !window.confirm(
        t(
          "Sell {{quantity}} {{unit}} of {{crop}} to government at MSP?\n\nMSP Rate: ₹{{price}}/{{unit}}\nTotal Amount: ₹{{total}}\n\nNote: This will not be listed on marketplace.",
          {
            quantity: selectedOutput.quantity,
            unit: selectedOutput.unit,
            crop: selectedOutput.cropId?.cropName,
            price: mspData.price,
            total: totalAmount.toLocaleString(),
          },
        ),
      )
    )
      return;

    try {
      const res = await authFetch(`${API_BASE_URL}/api/sales/government-msp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropOutputId: selectedOutput._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("Government procurement request submitted successfully!"));
        closeSaleModal();
        fetchOutputs();
      } else {
        alert(data.message || t("Failed to submit request"));
      }
    } catch (error) {
      console.error("List MSP Error:", error);
      alert(t("Network error occurred"));
    }
  };

  if (loading) {
    return (
      <div className="harvest-page-loading">
        <div className="fr-spinner fr-spinner-teal" />
      </div>
    );
  }

  return (
    <div className="harvest-page-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("My Harvest")}</span>
        </div>
        <div className="fr-page-title">🌽 {t("My Harvest")}</div>
      </div>

      <div className="harvest-filter-bar">
        <button
          className={`harvest-filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {t("All")}
        </button>
        <button
          className={`harvest-filter-btn ${
            filter === "available" ? "active" : ""
          }`}
          onClick={() => setFilter("available")}
        >
          {t("Available")}
        </button>
        <button
          className={`harvest-filter-btn ${
            filter === "quality-pending" ? "active" : ""
          }`}
          onClick={() => setFilter("quality-pending")}
        >
          {t("Quality Pending")}
        </button>
        <button
          className={`harvest-filter-btn ${
            filter === "quality-approved" ? "active" : ""
          }`}
          onClick={() => setFilter("quality-approved")}
        >
          {t("Certified")}
        </button>
        <button
          className={`harvest-filter-btn ${
            filter === "quality-rejected" ? "active" : ""
          }`}
          onClick={() => setFilter("quality-rejected")}
        >
          {t("Quality Rejected")}
        </button>
        <button
          className={`harvest-filter-btn ${
            filter === "listed-for-sale" ? "active" : ""
          }`}
          onClick={() => setFilter("listed-for-sale")}
        >
          {t("Listed")}
        </button>
      </div>

      <div className="harvest-stats-grid">
        <div className="harvest-stat-card">
          <div className="harvest-stat-value">{filteredOutputs.length}</div>
          <div className="harvest-stat-label">{t("Total Harvests")}</div>
        </div>
        <div className="harvest-stat-card">
          <div className="harvest-stat-value" style={{ color: "#4CAF50" }}>
            {cropOutputs.filter((o) => o.qualityStatus === "approved").length}
          </div>
          <div className="harvest-stat-label">{t("Certified")}</div>
        </div>
      </div>

      {filteredOutputs.length === 0 ? (
        <div className="harvest-empty-state">
          <div style={{ fontSize: 48 }}>📦</div>
          <p>{t("No crop outputs yet")}</p>
          <p className="harvest-empty-subtext">
            {filter === "all"
              ? t("Harvest crops from your fields to see them here")
              : t("No {{filter}} harvests found", {
                  filter: filter.replace("-", " "),
                })}
          </p>
        </div>
      ) : (
        <div className="harvest-outputs-grid">
          {filteredOutputs.map((output) => (
            <div key={output._id} className="harvest-output-card">
              <div className="harvest-card-header">
                <div className="harvest-card-title">
                  <span className="harvest-crop-icon">
                    {output.cropId?.icon || "🌱"}
                  </span>
                  <div>
                    <div className="harvest-crop-name">
                      {output.cropId?.cropName}
                    </div>
                    <div className="harvest-field-name">
                      {t("Field")}: {output.fieldId?.name || t("Unknown")}
                    </div>
                  </div>
                </div>
                <div className="harvest-status-badges">
                  {output.qualityStatus &&
                    output.qualityStatus !== "not-requested" && (
                      <div
                        className="harvest-status-badge"
                        style={{
                          background: getQualityStatusColor(
                            output.qualityStatus,
                          ),
                        }}
                      >
                        📜 {getQualityStatusText(output.qualityStatus)}
                      </div>
                    )}
                  <div
                    className="harvest-status-badge"
                    style={{ background: getSaleStatusColor(output.status) }}
                  >
                    {getSaleStatusText(output.status)}
                  </div>
                </div>
              </div>

              <div className="harvest-card-details">
                <div className="harvest-detail-row">
                  ⚖️ {output.quantity} {output.unit}
                </div>
                <div className="harvest-detail-row">
                  📅 {t("Harvested")}:{" "}
                  {new Date(output.harvestDate).toLocaleDateString()}
                </div>
                {output.storageLocation && (
                  <div className="harvest-detail-row">
                    🏭 {output.storageLocation}
                  </div>
                )}
              </div>

              <div className="harvest-card-actions">
                {(!output.qualityStatus ||
                  output.qualityStatus === "not-requested") &&
                  output.status === "available" && (
                    <button
                      className="harvest-action-btn harvest-action-primary"
                      onClick={() => handleRequestQuality(output)}
                    >
                      📜 {t("Request Quality Check")}
                    </button>
                  )}

                {output.qualityStatus === "approved" && (
                  <button
                    className="harvest-action-btn harvest-action-success"
                    onClick={() => handleViewCertificate(output)}
                  >
                    📜 {t("View Certificate")}
                  </button>
                )}

                {output.status === "available" && (
                  <div className="harvest-sale-buttons">
                    <button
                      className="harvest-action-btn harvest-action-secondary"
                      onClick={() => openSaleModal(output, "marketplace")}
                    >
                      🛒 {t("List on Market")}
                    </button>
                    {output.cropId?.hasMSP && (
                      <button
                        className="harvest-action-btn harvest-action-msp"
                        onClick={() => openSaleModal(output, "msp")}
                      >
                        🏛️ {t("Sell at MSP")}
                      </button>
                    )}
                  </div>
                )}

                {output.qualityStatus === "pending" && (
                  <div className="harvest-pending-info">
                    <span>⏳</span>
                    <div>
                      <div>{t("Quality inspection in progress...")}</div>
                      <button
                        className="harvest-track-link"
                        onClick={() => handleViewCertificate(output)}
                      >
                        {t("Track status")} →
                      </button>
                    </div>
                  </div>
                )}

                {output.qualityStatus === "rejected" && (
                  <div className="harvest-rejected-info">
                    <span>⚠️</span>
                    <div>
                      <div>{t("Quality inspection failed")}</div>
                      <button
                        className="harvest-details-link"
                        onClick={() => handleViewCertificate(output)}
                      >
                        {t("View details")} →
                      </button>
                    </div>
                  </div>
                )}

                {output.status === "listed-for-sale" && (
                  <div className="harvest-listed-info">
                    <div className="harvest-listed-content">
                      <span>✓</span>
                      <span>{t("Listed for sale")}</span>
                    </div>
                    <button className="harvest-view-listing">
                      {t("View Details")} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sale Modal */}
      {showSaleModal && (
        <div className="harvest-modal-overlay">
          <div className="harvest-modal-content">
            <div className="harvest-modal-header">
              <h3>
                {saleType === "marketplace"
                  ? t("List on Marketplace")
                  : t("Sell to Government")}
              </h3>
              <button className="harvest-modal-close" onClick={closeSaleModal}>
                ✕
              </button>
            </div>

            {selectedOutput && (
              <>
                <div className="harvest-modal-crop-info">
                  <span className="harvest-modal-crop-icon">
                    {selectedOutput.cropId?.icon || "🌱"}
                  </span>
                  <div>
                    <div className="harvest-modal-crop-name">
                      {selectedOutput.cropId?.cropName}
                    </div>
                    <div className="harvest-modal-crop-quantity">
                      {selectedOutput.quantity} {selectedOutput.unit}
                    </div>
                  </div>
                </div>

                {saleType === "marketplace" ? (
                  <form onSubmit={handleListForMarketplace}>
                    <div className="fr-form-group">
                      <label className="fr-label">
                        {t("Set Minimum Price")}
                      </label>
                      <div className="harvest-price-input-container">
                        <span className="harvest-currency">₹</span>
                        <input
                          className="harvest-price-input"
                          type="number"
                          step="0.01"
                          placeholder={t("Enter minimum price")}
                          value={minimumPrice}
                          onChange={(e) => setMinimumPrice(e.target.value)}
                          required
                        />
                        <span className="harvest-unit">
                          /{selectedOutput.unit}
                        </span>
                      </div>
                      <div className="fr-input-hint">
                        {t(
                          "Set the lowest price you're willing to accept per {{unit}}",
                          { unit: selectedOutput.unit },
                        )}
                      </div>
                    </div>
                    <button type="submit" className="fr-btn fr-btn-teal">
                      {t("List on Marketplace")}
                    </button>
                  </form>
                ) : (
                  <>
                    {loadingMSP ? (
                      <div className="harvest-loading-msp">
                        <div className="fr-spinner fr-spinner-teal" />
                      </div>
                    ) : mspData ? (
                      <>
                        <div className="harvest-msp-info-card">
                          <div className="harvest-msp-label">
                            {t("MSP Rate")}
                          </div>
                          <div className="harvest-msp-price">
                            ₹{mspData.price}/{mspData.unit}
                          </div>
                          <div className="harvest-msp-divider" />
                          <div className="harvest-msp-label">
                            {t("Total Amount")}
                          </div>
                          <div className="harvest-msp-total">
                            ₹
                            {(
                              mspData.price * selectedOutput.quantity
                            ).toLocaleString()}
                          </div>
                        </div>

                        <div className="harvest-msp-note">
                          <span>ℹ️</span>
                          <span>
                            {t(
                              "This crop will be sold to the government and will not appear on the marketplace",
                            )}
                          </span>
                        </div>

                        <button
                          className="fr-btn fr-btn-teal"
                          onClick={handleListForMSP}
                          style={{ background: "#E76F51" }}
                        >
                          {t("Submit to Government")}
                        </button>
                      </>
                    ) : (
                      <div className="harvest-no-msp">
                        <div style={{ fontSize: 48 }}>⚠️</div>
                        <p>{t("MSP not available for this crop")}</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
