import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/expense-prediction.css";

export default function ExpensePredictionPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [crops, setCrops] = useState([]);
  const [fields, setFields] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [landArea, setLandArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [useSoilData, setUseSoilData] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSoilData, setHasSoilData] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cropRes, fieldRes] = await Promise.all([
        authFetch(`${API_BASE_URL}/api/crops/crops`),
        authFetch(`${API_BASE_URL}/api/farm/fields`),
      ]);

      if (cropRes.ok) {
        const cropData = await cropRes.json();
        setCrops(cropData.crops || []);
      }
      if (fieldRes.ok) {
        const fieldData = await fieldRes.json();
        setFields(fieldData.fields || []);
      }
    } catch (err) {
      console.error("Initialization Error", err);
    }
  };

  const handleSelectField = async (field) => {
    setSelectedField(field);
    setLandArea(field.area.toString());
    setUseSoilData(false);

    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/data/soil/latest?fieldId=${field._id}`,
      );
      const data = await res.json();
      setHasSoilData(!!data.soilData);
    } catch (err) {
      setHasSoilData(false);
    }
  };

  const handlePredictExpense = async () => {
    setError(null);
    if (!selectedCrop || !landArea) {
      setError(t("Please select a crop and land area."));
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE_URL}/api/data/expenses/predict?crop=${
        selectedCrop.cropName
      }&area=${landArea}&fieldId=${
        selectedField?._id || ""
      }&useSoilData=${useSoilData}`;

      const res = await authFetch(url);

      if (!res.ok) throw new Error(t("Failed to calculate prediction."));
      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter((c) =>
    c.cropName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="ep-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("Expense Prediction")}</span>
        </div>
        <div className="fr-page-title">💹 {t("Expense Prediction")}</div>
      </div>

      <div className="ep-content">
        <div className="ep-section">
          <div className="ep-section-title">{t("Select Field")}</div>
          <div className="ep-field-list">
            {fields.map((f) => (
              <button
                key={f._id}
                onClick={() => handleSelectField(f)}
                className={`ep-field-chip ${selectedField?._id === f._id ? "active" : ""}`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="ep-row">
          <div className="ep-input-group">
            <label className="fr-label">{t("Land Area (Acres)")}</label>
            <input
              className="fr-input"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              type="number"
              step="0.1"
              placeholder="0.0"
            />
          </div>

          <button
            disabled={!hasSoilData}
            onClick={() => setUseSoilData(!useSoilData)}
            className={`ep-soil-toggle ${useSoilData ? "active" : ""} ${!hasSoilData ? "disabled" : ""}`}
          >
            🧪 {hasSoilData ? t("Soil-Sync") : t("No Soil Data")}
          </button>
        </div>

        <div className="ep-section">
          <div className="ep-section-title">{t("Select Crop")}</div>
          <input
            className="ep-search"
            placeholder={t("Search 30+ crops...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="ep-crops-grid">
            {filteredCrops.map((crop) => (
              <button
                key={crop._id}
                className={`ep-crop-card ${selectedCrop?._id === crop._id ? "active" : ""}`}
                onClick={() => setSelectedCrop(crop)}
              >
                <div className="ep-crop-icon">🌱</div>
                <div className="ep-crop-name">{crop.cropName}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          className="fr-btn fr-btn-teal"
          onClick={handlePredictExpense}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="fr-spinner" /> {t("Analyzing...")}
            </>
          ) : (
            t("Analyze Profitability")
          )}
        </button>

        {error && (
          <div className="fr-alert fr-alert-error">
            <span>⚠</span> {error}
          </div>
        )}

        {prediction && (
          <div className="ep-result">
            <div className="ep-total-card">
              <div className="ep-total-label">
                {t("Total Estimated Investment")}
              </div>
              <div className="ep-total-amount">
                {formatCurrency(prediction.totalExpense)}
              </div>
            </div>

            <div className="ep-breakdown">
              <h3 className="ep-breakdown-title">{t("Cost Breakdown")}</h3>
              {prediction.breakdown &&
                Object.entries(prediction.breakdown).map(([key, val]) => (
                  <div key={key} className="ep-breakdown-row">
                    <span className="ep-breakdown-label">
                      {t(key.charAt(0).toUpperCase() + key.slice(1))}
                    </span>
                    <span className="ep-breakdown-value">
                      {formatCurrency(val)}
                    </span>
                  </div>
                ))}
            </div>

            {(prediction.expectedRevenueMSP ||
              prediction.expectedRevenueMarket) && (
              <div className="ep-revenue-section">
                <h3 className="ep-section-title">
                  {t("Expected Revenue Scenarios")}
                </h3>
                <div className="ep-comparison-row">
                  {prediction.expectedRevenueMSP !== null && (
                    <div
                      className={`ep-rev-card ${
                        prediction.metadata?.recommendedChannel ===
                        "Government (MSP)"
                          ? "best"
                          : ""
                      }`}
                    >
                      {prediction.metadata?.recommendedChannel ===
                        "Government (MSP)" && (
                        <div className="ep-best-badge">{t("BEST")}</div>
                      )}
                      <div className="ep-rev-label">{t("Govt MSP")}</div>
                      <div className="ep-rev-val">
                        {formatCurrency(prediction.expectedRevenueMSP)}
                      </div>
                      <div className="ep-profit-label">
                        {t("Net Profit")}:{" "}
                        {formatCurrency(
                          prediction.expectedRevenueMSP -
                            prediction.totalExpense,
                        )}
                      </div>
                    </div>
                  )}

                  {prediction.expectedRevenueMarket !== null && (
                    <div
                      className={`ep-rev-card market ${
                        prediction.metadata?.recommendedChannel ===
                        "Marketplace"
                          ? "best"
                          : ""
                      }`}
                    >
                      {prediction.metadata?.recommendedChannel ===
                        "Marketplace" && (
                        <div className="ep-best-badge market">{t("BEST")}</div>
                      )}
                      <div className="ep-rev-label">{t("Market Price")}</div>
                      <div className="ep-rev-val">
                        {formatCurrency(prediction.expectedRevenueMarket)}
                      </div>
                      <div className="ep-location-tag">
                        📍 {prediction.metadata?.locationUsed}
                      </div>
                      <div className="ep-profit-label market">
                        {t("Net Profit")}:{" "}
                        {formatCurrency(
                          prediction.expectedRevenueMarket -
                            prediction.totalExpense,
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
