import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "../../config";
import "../../styles/view-msp.css";

export default function ViewMspPage() {
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mspList, setMspList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSeasonFilter, setActiveSeasonFilter] = useState(t("All"));
  const [initialFetchError, setInitialFetchError] = useState(null);

  useEffect(() => {
    fetchMspData();
  }, []);

  const fetchMspData = async () => {
    setRefreshing(true);
    setInitialFetchError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/msp`);

      if (!res.ok) {
        throw new Error(t("Failed to fetch MSP data."));
      }

      const data = await res.json();
      const fetchedList = data.data || [];

      setMspList(fetchedList);
    } catch (error) {
      console.error("MSP Fetch Error:", error.message);
      setInitialFetchError(t("Could not connect to fetch public price list."));
      setMspList([]);
      setFilteredList([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let listToFilter = mspList;
    let lowerQuery = searchQuery.toLowerCase().trim();
    let seasonFilter = activeSeasonFilter;

    if (seasonFilter !== t("All")) {
      listToFilter = listToFilter.filter(
        (msp) => msp.season.toLowerCase() === seasonFilter.toLowerCase(),
      );
    }

    if (lowerQuery !== "") {
      listToFilter = listToFilter.filter(
        (msp) =>
          msp.cropName.toLowerCase().includes(lowerQuery) ||
          msp.season.toLowerCase().includes(lowerQuery),
      );
    }

    setFilteredList(listToFilter);
  }, [searchQuery, mspList, activeSeasonFilter]);

  const formatCurrency = (amount) => {
    if (amount === null || isNaN(amount)) return t("N/A");
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeasonColor = (season) => {
    switch (season.toLowerCase()) {
      case "kharif":
        return "#2A9D8F";
      case "rabi":
        return "#F4A261";
      default:
        return "#457B9D";
    }
  };

  const totalCrops = mspList.length;
  const kharifCount = mspList.filter(
    (msp) => msp.season.toLowerCase() === "kharif",
  ).length;
  const rabiCount = mspList.filter(
    (msp) => msp.season.toLowerCase() === "rabi",
  ).length;

  if (loading) {
    return (
      <div className="msp-loading">
        <div className="fr-spinner fr-spinner-teal" />
        <p>{t("Fetching Public MSP Data...")}</p>
      </div>
    );
  }

  return (
    <div className="msp-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("MSP Rates")}</span>
        </div>
        <div className="fr-page-title">📊 {t("Minimum Support Price")}</div>
        <div className="fr-page-subtitle">
          {t("Official MSP rates for key crops")} ({mspList.length}{" "}
          {t("total listed")})
        </div>
      </div>

      <div className="msp-search-container">
        <span className="msp-search-icon">🔍</span>
        <input
          className="msp-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("Search by crop name or season...")}
        />
        {searchQuery.length > 0 && (
          <button
            className="msp-clear-button"
            onClick={() => setSearchQuery("")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="msp-summary-stats-container">
        <div className="msp-summary-stat-item">
          <div className="msp-stat-label">{t("Total Crops")}</div>
          <div className="msp-stat-value">{totalCrops}</div>
        </div>
        <div className="msp-summary-stat-divider" />
        <div className="msp-summary-stat-item">
          <div className="msp-stat-label">{t("Kharif Crops")}</div>
          <div className="msp-stat-value" style={{ color: "#2A9D8F" }}>
            {kharifCount}
          </div>
        </div>
        <div className="msp-summary-stat-divider" />
        <div className="msp-summary-stat-item">
          <div className="msp-stat-label">{t("Rabi Crops")}</div>
          <div className="msp-stat-value" style={{ color: "#F4A261" }}>
            {rabiCount}
          </div>
        </div>
      </div>

      <div className="msp-filter-container">
        {[t("All"), t("Kharif"), t("Rabi")].map((season) => (
          <button
            key={season}
            className={`msp-filter-pill ${activeSeasonFilter === season ? "active" : ""}`}
            style={
              activeSeasonFilter === season
                ? {
                    backgroundColor: getSeasonColor(season) || "#457B9D",
                    borderColor: getSeasonColor(season) || "transparent",
                  }
                : {}
            }
            onClick={() => setActiveSeasonFilter(season)}
          >
            {season}
          </button>
        ))}
      </div>

      {initialFetchError && (
        <div className="fr-alert fr-alert-error">
          <span>⚠</span> {t("Error")}: {initialFetchError}
        </div>
      )}

      {filteredList.length > 0 ? (
        <div className="msp-list">
          {filteredList.map((msp) => (
            <div key={msp._id} className="msp-card">
              <div className="msp-card-header">
                <div className="msp-crop-name">{msp.cropName}</div>
                <div
                  className="msp-season-badge"
                  style={{ backgroundColor: getSeasonColor(msp.season) }}
                >
                  {msp.season.toUpperCase()}
                </div>
              </div>

              <div className="msp-price-row">
                <div className="msp-price-column">
                  <div className="msp-price-label">{t("MSP Rate")}</div>
                  <div className="msp-price-value">
                    {formatCurrency(msp.price)}
                  </div>
                  <div className="msp-price-unit">
                    {t("per")} {msp.unit || t("quintal")}
                  </div>
                </div>

                <div className="msp-detail-column">
                  <div className="msp-detail-label">
                    {t("Implemented Year")}
                  </div>
                  <div className="msp-detail-value">
                    {msp.implementedYear || "2024-25"}
                  </div>

                  <div className="msp-detail-label">{t("Grade")}</div>
                  <div className="msp-detail-value">
                    {msp.grade || t("A Grade")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !initialFetchError && (
          <div className="msp-no-results">
            <div className="msp-no-results-text">
              {t("No results found for")} "{searchQuery || activeSeasonFilter}"
            </div>
            <div className="msp-no-results-subtext">
              {t("Try adjusting your search or filter.")}
            </div>
          </div>
        )
      )}
    </div>
  );
}
