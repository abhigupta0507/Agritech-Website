import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";

export default function AlertsScreen() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch fields on mount
  useEffect(() => {
    fetchFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFields = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/farm/fields`);

      if (!res.ok) {
        throw new Error(`Failed to fetch fields: ${res.status}`);
      }

      const data = await res.json();
      setFields(data.fields || []);

      // Auto-select first field if available
      if (data.fields && data.fields.length > 0) {
        handleFieldChange(data.fields[0]);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(`Failed to load fields: ${err.message}`);
      setLoading(false);
    }
  };

  const handleFieldChange = (field) => {
    setSelectedField(field);
    setError(null);
    fetchFieldData(field._id);
  };

  const fetchFieldData = async (fieldId) => {
    if (!fieldId) return;

    setRefreshing(true);
    try {
      // 1. Fetch Weather Data for specific field
      const weatherRes = await authFetch(
        `${API_BASE_URL}/api/data/weather?fieldId=${fieldId}`,
      );

      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json();
        setWeatherData(weatherJson.weather);
      } else {
        const errorText = await weatherRes.text();
        setWeatherData(null);
        setError(`Weather: ${errorText}`);
      }

      // 2. Fetch Alerts for specific field
      const alertsRes = await authFetch(
        `${API_BASE_URL}/api/data/alerts?fieldId=${fieldId}`,
      );

      if (alertsRes.ok) {
        const alertsJson = await alertsRes.json();
        setAlerts(alertsJson.alerts || []);
      } else {
        const errorText = await alertsRes.text();
        setAlerts([]);
        setError((prev) =>
          prev ? `${prev} | Alerts: ${errorText}` : `Alerts: ${errorText}`,
        );
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchFields();
    if (selectedField) {
      fetchFieldData(selectedField._id);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#E76F51";
      case "medium":
        return "#F4A261";
      case "low":
        return "#E9C46A";
      default:
        return "#888";
    }
  };

  const getForecastIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes("sun") || cond.includes("clear")) return "☀️";
    if (cond.includes("rain") || cond.includes("drizzle")) return "🌧️";
    if (cond.includes("snow") || cond.includes("ice")) return "❄️";
    if (cond.includes("cloud") || cond.includes("overcast")) return "☁️";
    if (cond.includes("thunder") || cond.includes("storm")) return "⛈️";
    return "⛅";
  };

  const getAlertIcon = (type) => {
    return type === "disease" ? "🐛" : "⚠️";
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "#2A9D8F", marginTop: "12px" }}>
          {t("Loading Data...")}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.screenWrapper}>
      <div style={styles.container}>
        {/* Header Row */}
        <div style={styles.headerRow}>
          <h1 style={styles.header}>{t("Weather & Alerts")}</h1>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            style={{
              ...styles.refreshBtn,
              opacity: refreshing ? 0.5 : 1,
              cursor: refreshing ? "not-allowed" : "pointer",
            }}
          >
            {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div style={styles.errorCard}>
            <span style={{ fontSize: "24px" }}>❌</span>
            <div style={{ flex: 1 }}>
              <span style={styles.errorText}>{error}</span>
            </div>
            <button
              style={styles.retryBtn}
              onClick={() => selectedField && fetchFieldData(selectedField._id)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Field Selection */}
        {fields.length > 0 && (
          <div style={styles.fieldSection}>
            <h3 style={styles.sectionLabel}>{t("Select Field")}</h3>
            <div style={styles.fieldSelector}>
              {fields.map((field) => {
                const isActive = selectedField?._id === field._id;
                return (
                  <button
                    key={field._id}
                    onClick={() => handleFieldChange(field)}
                    style={{
                      ...styles.fieldChip,
                      ...(isActive ? styles.fieldChipActive : {}),
                    }}
                  >
                    {field.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Show message if no fields */}
        {fields.length === 0 && !loading && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: "48px", color: "#ccc" }}>📍</span>
            <h3 style={styles.emptyStateText}>No fields found</h3>
            <p style={styles.emptyStateSubtext}>
              Add fields to see weather and alerts
            </p>
          </div>
        )}

        {/* Field Info */}
        {selectedField && !loading && (
          <>
            <div style={styles.fieldInfoCard}>
              <span style={{ fontSize: "20px", color: "#2A9D8F" }}>📍</span>
              <div style={styles.fieldInfoText}>
                <div style={styles.fieldName}>{selectedField.name}</div>
                <div style={styles.fieldDetails}>
                  {selectedField.area} acres
                </div>
              </div>
            </div>

            {/* Weather Card */}
            {weatherData ? (
              <div style={styles.weatherCard}>
                <div style={styles.weatherHeader}>
                  <span style={{ fontSize: "40px" }}>
                    {getForecastIcon(weatherData.condition || "")}
                  </span>
                  <div>
                    <div style={styles.weatherTitle}>
                      {t("Current Weather")}
                    </div>
                    <div style={styles.weatherLocation}>
                      {weatherData.location || selectedField.name}
                    </div>
                  </div>
                </div>

                <div style={styles.weatherGrid}>
                  <div style={styles.weatherItem}>
                    <span style={styles.weatherIcon}>🌡️</span>
                    <div>
                      <div style={styles.weatherLabel}>{t("Temperature")}</div>
                      <div style={styles.weatherValue}>
                        {weatherData.temperature}°C
                      </div>
                    </div>
                  </div>

                  <div style={styles.weatherItem}>
                    <span style={styles.weatherIcon}>💧</span>
                    <div>
                      <div style={styles.weatherLabel}>{t("Humidity")}</div>
                      <div style={styles.weatherValue}>
                        {weatherData.humidity}%
                      </div>
                    </div>
                  </div>

                  <div style={styles.weatherItem}>
                    <span style={styles.weatherIcon}>🌧️</span>
                    <div>
                      <div style={styles.weatherLabel}>{t("Rainfall")}</div>
                      <div style={styles.weatherValue}>
                        {weatherData.rainfall}mm
                      </div>
                    </div>
                  </div>

                  <div style={styles.weatherItem}>
                    <span style={styles.weatherIcon}>🌬️</span>
                    <div>
                      <div style={styles.weatherLabel}>{t("Wind")}</div>
                      <div style={styles.weatherValue}>
                        {weatherData.windSpeed} {t("km/h")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : !error ? (
              <div style={styles.noDataCard}>
                <span style={{ fontSize: "48px" }}>☁️</span>
                <p style={styles.noDataText}>No weather data available</p>
              </div>
            ) : null}

            {/* Forecast Section */}
            {weatherData?.forecast && (
              <div style={{ marginBottom: "32px" }}>
                <h3 style={styles.sectionTitle}>{t("Forecast")}</h3>
                <div style={styles.forecastContainer}>
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} style={styles.forecastCard}>
                      <div style={styles.forecastDate}>
                        {new Date(day.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                        })}
                      </div>
                      <span style={{ fontSize: "32px", margin: "8px 0" }}>
                        {getForecastIcon(day.condition)}
                      </span>
                      <div style={styles.forecastTemp}>{day.avgTemp}°C</div>
                      <div style={styles.forecastCondition}>
                        {day.condition}
                      </div>
                      <div style={styles.forecastCondition}>
                        {day.windSpeed} km/h
                      </div>
                      <div style={styles.rainChanceRow}>
                        <span>💧</span>
                        <span style={styles.rainChanceText}>
                          {day.chanceOfRain}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts Section */}
            <h3 style={styles.sectionTitle}>{t("Active Alerts")}</h3>

            {alerts.length > 0 ? (
              <div style={styles.alertsContainer}>
                {alerts.map((alert) => (
                  <div
                    key={alert._id}
                    style={{
                      ...styles.alertCard,
                      borderLeftColor: getSeverityColor(alert.severity),
                    }}
                  >
                    <div style={styles.alertHeader}>
                      <div style={styles.alertTitleRow}>
                        <span style={{ fontSize: "24px" }}>
                          {getAlertIcon(alert.type)}
                        </span>
                        <span style={styles.alertTitle}>{alert.title}</span>
                      </div>
                      <div
                        style={{
                          ...styles.severityBadge,
                          backgroundColor: getSeverityColor(alert.severity),
                        }}
                      >
                        {alert.severity.toUpperCase()}
                      </div>
                    </div>

                    <p style={styles.alertDescription}>{alert.description}</p>

                    <div style={styles.alertFooter}>
                      {alert.crop && (
                        <div style={styles.cropTag}>
                          <span>🌱</span>
                          <span>{alert.crop}</span>
                        </div>
                      )}
                      <span style={styles.alertDate}>
                        {new Date(alert.dateGenerated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noAlertsCard}>
                <span style={{ fontSize: "48px", color: "#2A9D8F" }}>✅</span>
                <p style={styles.noAlertsText}>
                  No active alerts for {selectedField.name}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  screenWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F7F9FC",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(42, 157, 143, 0.2)",
    borderTop: "4px solid #2A9D8F",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  header: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#264653",
    margin: 0,
  },
  refreshBtn: {
    padding: "8px 16px",
    backgroundColor: "white",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    color: "#264653",
    fontWeight: "600",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
  },
  errorCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
    gap: "12px",
    borderLeft: "4px solid #E76F51",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: "14px",
    fontWeight: "500",
  },
  retryBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#D32F2F",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
  fieldSection: {
    marginBottom: "24px",
  },
  sectionLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "12px",
    marginTop: 0,
  },
  fieldSelector: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "8px",
    WebkitOverflowScrolling: "touch",
  },
  fieldChip: {
    padding: "10px 20px",
    backgroundColor: "white",
    border: "1px solid #E0E0E0",
    borderRadius: "24px",
    color: "#666",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "all 0.2s ease",
  },
  fieldChipActive: {
    backgroundColor: "#2A9D8F",
    color: "white",
    borderColor: "#2A9D8F",
    boxShadow: "0 4px 8px rgba(42, 157, 143, 0.2)",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    backgroundColor: "white",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px dashed #CCC",
  },
  emptyStateText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#666",
    margin: "16px 0 8px 0",
  },
  emptyStateSubtext: {
    fontSize: "14px",
    color: "#999",
    margin: 0,
  },
  fieldInfoCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  fieldName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#264653",
  },
  fieldDetails: {
    fontSize: "14px",
    color: "#666",
  },
  weatherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  weatherHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    borderBottom: "1px solid #F0F0F0",
    paddingBottom: "16px",
  },
  weatherTitle: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
  },
  weatherLocation: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#264653",
  },
  weatherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "20px",
  },
  weatherItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#F8F9FA",
    padding: "16px",
    borderRadius: "12px",
  },
  weatherIcon: {
    fontSize: "24px",
  },
  weatherLabel: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "4px",
  },
  weatherValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#264653",
  },
  noDataCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    marginBottom: "32px",
    border: "1px solid #EEE",
  },
  noDataText: {
    color: "#888",
    marginTop: "16px",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#264653",
    marginBottom: "16px",
    marginTop: 0,
  },
  forecastContainer: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "16px",
  },
  forecastCard: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "12px",
    minWidth: "120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  forecastDate: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  forecastTemp: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#264653",
    marginBottom: "8px",
  },
  forecastCondition: {
    fontSize: "12px",
    color: "#888",
    textAlign: "center",
    marginBottom: "4px",
  },
  rainChanceRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "8px",
    backgroundColor: "#E3F2FD",
    padding: "4px 8px",
    borderRadius: "12px",
  },
  rainChanceText: {
    fontSize: "11px",
    color: "#1976D2",
    fontWeight: "600",
  },
  alertsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  alertCard: {
    backgroundColor: "white",
    borderLeftWidth: "6px",
    borderLeftStyle: "solid",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  alertHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "12px",
  },
  alertTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  alertTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#264653",
  },
  severityBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  alertDescription: {
    fontSize: "15px",
    color: "#444",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
  },
  alertFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #F0F0F0",
  },
  cropTag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: "600",
  },
  alertDate: {
    fontSize: "13px",
    color: "#888",
  },
  noAlertsCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "12px",
    border: "1px solid #EEE",
  },
  noAlertsText: {
    fontSize: "16px",
    color: "#2A9D8F",
    fontWeight: "600",
    marginTop: "16px",
  },
};

// Add this to your main CSS file (e.g. index.css) or inject it for the loading spinner to work
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
