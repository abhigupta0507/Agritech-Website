// src/fasalrath/pages/govt/MspCompliancePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function MspCompliancePage() {
  const navigate = useNavigate();
  const { authFetch } = useGovtAuth();
  const { t } = useTranslation();

  const [mspData, setMspData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("kharif");

  const fetchMSPData = async () => {
    setLoading(true);
    try {
      const endpoint =
        filter === "all"
          ? `${API_BASE_URL}/api/msp`
          : `${API_BASE_URL}/api/msp?season=${filter}`;

      const response = await fetch(endpoint);
      const data = await response.json();
      setMspData(data.data || []);
    } catch (error) {
      console.error("Fetch MSP Error:", error);
      alert(t("Failed to fetch MSP data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMSPData();
  }, [filter]);

  const handleEdit = (item) => {
    navigate("/fasalrath/govt/edit-msp", {
      state: {
        id: item._id,
        cropName: item.cropName,
        price: item.price.toString(),
        unit: item.unit,
        season: item.season,
      },
    });
  };

  const getSeasonColor = (season) => {
    switch (season) {
      case "kharif":
        return "#2A9D8F";
      case "rabi":
        return "#E76F51";
      case "year-round":
        return "#457B9D";
      default:
        return "#666";
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          {t("MSP")} {filter === "rabi" ? "(2026-2027)" : "(2025-2026)"}
        </h1>
        <button
          style={styles.addButton}
          onClick={() => navigate("/fasalrath/govt/add-msp")}
        >
          <span style={styles.addIcon}>+</span>
        </button>
      </div>

      <div style={styles.filterContainer}>
        <FilterButton
          label={t("Kharif")}
          value="kharif"
          filter={filter}
          setFilter={setFilter}
        />
        <FilterButton
          label={t("Rabi")}
          value="rabi"
          filter={filter}
          setFilter={setFilter}
        />
        <FilterButton
          label={t("Year-Round")}
          value="year-round"
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      <div style={styles.container}>
        <div style={styles.listHeader}>
          <span>
            {mspData.length} {t("crops listed")}
          </span>
          <button style={styles.refreshButton} onClick={fetchMSPData}>
            {t("Refresh")}
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        ) : mspData.length === 0 ? (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>⚠️</div>
            <div style={styles.emptyText}>{t("No MSP data available")}</div>
          </div>
        ) : (
          mspData.map((item) => (
            <div
              key={item._id}
              style={styles.card}
              onClick={() => handleEdit(item)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>
                  <span style={styles.leafIcon}>🌿</span>
                  <span style={styles.cropName}>{item.cropName}</span>
                </div>
                <div
                  style={{
                    ...styles.seasonBadge,
                    backgroundColor: getSeasonColor(item.season),
                  }}
                >
                  <span style={styles.seasonText}>
                    {item.season === "year-round"
                      ? t("All Year")
                      : item.season.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.priceContainer}>
                  <div style={styles.priceLabel}>{t("MSP Price")}</div>
                  <div style={styles.priceValue}>₹{item.price}</div>
                  <div style={styles.unitText}>
                    {t("per")} {item.unit}
                  </div>
                </div>

                <button
                  style={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  ✏️
                </button>
              </div>

              {item.effectiveFrom && (
                <div style={styles.effectiveText}>
                  {t("Effective from")}:{" "}
                  {new Date(item.effectiveFrom).toLocaleDateString("en-IN")}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterButton({ label, value, filter, setFilter }) {
  return (
    <button
      style={{
        ...styles.filterButton,
        ...(filter === value ? styles.filterButtonActive : {}),
      }}
      onClick={() => setFilter(value)}
    >
      <span
        style={{
          ...styles.filterText,
          ...(filter === value ? styles.filterTextActive : {}),
        }}
      >
        {label}
      </span>
    </button>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#F8F9FA",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "40px 20px 16px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #E0E0E0",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#264653",
    margin: 0,
  },
  addButton: {
    width: "44px",
    height: "44px",
    borderRadius: "22px",
    backgroundColor: "#606C38",
    border: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  addIcon: {
    fontSize: "24px",
    color: "#FFF",
  },
  filterContainer: {
    display: "flex",
    padding: "12px 20px",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #E0E0E0",
    gap: "8px",
  },
  filterButton: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#F0F0F0",
    cursor: "pointer",
  },
  filterButtonActive: {
    backgroundColor: "#606C38",
  },
  filterText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#FFF",
  },
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    color: "#666",
    marginBottom: "16px",
    fontWeight: "600",
  },
  refreshButton: {
    background: "none",
    border: "none",
    color: "#0000FF",
    cursor: "pointer",
    fontSize: "16px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #606C38",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    borderLeft: "4px solid #606C38",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  leafIcon: {
    fontSize: "24px",
    marginRight: "8px",
  },
  cropName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#264653",
  },
  seasonBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
  },
  seasonText: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#FFF",
  },
  cardBody: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "4px",
  },
  priceValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#606C38",
  },
  unitText: {
    fontSize: "12px",
    color: "#666",
    marginTop: "2px",
  },
  editButton: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    backgroundColor: "#F0F2E6",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  effectiveText: {
    fontSize: "12px",
    color: "#888",
    marginTop: "12px",
    fontStyle: "italic",
  },
  emptyContainer: {
    textAlign: "center",
    marginTop: "80px",
  },
  emptyIcon: {
    fontSize: "48px",
  },
  emptyText: {
    marginTop: "16px",
    fontSize: "16px",
    color: "#666",
  },
};
