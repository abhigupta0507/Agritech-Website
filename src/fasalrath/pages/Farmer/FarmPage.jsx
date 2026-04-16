/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../../styles/farm.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyAm1FRdu2r1xGVlO7uB0RZkO0APWBDDS3w"; // Replace with your key

export default function FarmPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showUpdateCropModal, setShowUpdateCropModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  const [tempCoords, setTempCoords] = useState(null);
  const mapRef = useRef(null);
  const [fetchingGps, setFetchingGps] = useState(false);
  const [previewRegion, setPreviewRegion] = useState({
    lat: 20.5937,
    lng: 78.9629,
    zoom: 5,
  });

  const [newField, setNewField] = useState({
    name: "",
    area: "",
    soilType: "",
    coordinates: null,
  });

  const [selectedCropId, setSelectedCropId] = useState("");
  const [harvestData, setHarvestData] = useState({
    quantity: "",
    unit: "quintal",
    storageLocation: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fieldsRes = await authFetch(`${API_BASE_URL}/api/farm/fields`);
      if (fieldsRes.ok) {
        const data = await fieldsRes.json();
        setFields(data.fields || []);
      }
      const cropsRes = await authFetch(`${API_BASE_URL}/api/crops/crops`);
      if (cropsRes.ok) {
        const data = await cropsRes.json();
        setCrops(data.crops || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    setTempCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const getCurrentLocation = () => {
    setFetchingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setTempCoords({ lat: latitude, lng: longitude });
          setPreviewRegion({ lat: latitude, lng: longitude, zoom: 15 });
          setFetchingGps(false);
        },
        (error) => {
          alert(t("Failed to get location"));
          setFetchingGps(false);
        },
      );
    } else {
      alert(t("Geolocation not supported"));
      setFetchingGps(false);
    }
  };

  const confirmMapLocation = () => {
    if (tempCoords) {
      setNewField((prev) => ({ ...prev, coordinates: tempCoords }));
      setPreviewRegion({ lat: tempCoords.lat, lng: tempCoords.lng, zoom: 15 });
    }
    setMapModalVisible(false);
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!newField.name || !newField.area || !newField.coordinates) {
      alert(t("Please fill all required fields and select a location"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/farm/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newField.name,
          area: parseFloat(newField.area),
          soilType: newField.soilType || "Unknown",
          coordinates: newField.coordinates,
        }),
      });

      if (res.ok) {
        alert(t("Field added successfully"));
        setNewField({ name: "", area: "", soilType: "", coordinates: null });
        setShowAddFieldModal(false);
        fetchData();
      }
    } catch (error) {
      alert(t("Failed to add field"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCropForField = (field) => {
    setSelectedField(field);
    setSelectedCropId(field.cropId?._id || "");
    setShowUpdateCropModal(true);
  };

  const handleUpdateFieldCrop = async (e) => {
    e.preventDefault();
    if (!selectedCropId) {
      alert(t("Please select a crop"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/farm/fields/${selectedField._id}/crop`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cropId: selectedCropId,
            plantedDate: new Date(),
            expectedHarvest: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          }),
        },
      );

      if (res.ok) {
        alert(t("Crop planted successfully"));
        setShowUpdateCropModal(false);
        fetchData();
      }
    } catch (error) {
      alert(t("Failed to update crop"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenHarvestModal = (field) => {
    if (!field.cropId) {
      alert(t("No crop planted in this field"));
      return;
    }
    setSelectedField(field);
    setHarvestData({
      quantity: "",
      unit: "quintal",
      storageLocation: "",
      notes: "",
    });
    setShowHarvestModal(true);
  };

  const handleHarvestCrop = async (e) => {
    e.preventDefault();
    if (!harvestData.quantity) {
      alert(t("Please enter harvest quantity"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/crop-output/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldId: selectedField._id,
          quantity: parseFloat(harvestData.quantity),
          unit: harvestData.unit,
          storageLocation: harvestData.storageLocation,
          notes: harvestData.notes,
        }),
      });

      if (res.ok) {
        alert(
          t("Crop harvested and recorded successfully! Field is now fallow."),
        );
        setShowHarvestModal(false);
        fetchData();
      }
    } catch (error) {
      alert(t("Failed to record harvest"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      Growing: t("Growing"),
      Preparing: t("Preparing"),
      Harvesting: t("Harvesting"),
      Fallow: t("Fallow"),
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      Growing: "#2A9D8F",
      Preparing: "#F4A261",
      Harvesting: "#E9C46A",
      Fallow: "#888",
    };
    return colorMap[status] || "#666";
  };

  const totalArea = fields.reduce((sum, f) => sum + f.area, 0).toFixed(1);
  const activeFields = fields.filter((f) => f.status === "Growing").length;

  if (loading) {
    return (
      <div className="farm-page-loading">
        <div className="fr-spinner fr-spinner-teal" />
      </div>
    );
  }

  return (
    <div className="farm-page-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("My Farm & Fields")}</span>
        </div>
        <div className="fr-page-title">🌾 {t("My Farm & Fields")}</div>
      </div>

      <div className="farm-stats-grid">
        <div className="farm-stat-card">
          <div className="farm-stat-icon" style={{ background: "#e8f5f3" }}>
            🌍
          </div>
          <div className="farm-stat-value" style={{ color: "#1a7a6e" }}>
            {totalArea}
          </div>
          <div className="farm-stat-label">{t("Total Acres")}</div>
        </div>
        <div className="farm-stat-card">
          <div className="farm-stat-icon" style={{ background: "#fef7ee" }}>
            🌾
          </div>
          <div className="farm-stat-value" style={{ color: "#c2681e" }}>
            {activeFields}/{fields.length}
          </div>
          <div className="farm-stat-label">{t("Active Fields")}</div>
        </div>
      </div>

      <div className="fr-card fr-gap-20">
        <div className="fr-card-header">
          <span className="fr-card-title">{t("My Fields")}</span>
          <button
            className="fr-btn fr-btn-teal fr-btn-sm"
            onClick={() => setShowAddFieldModal(true)}
            style={{ width: "auto" }}
          >
            ➕ {t("Add Field")}
          </button>
        </div>
        <div className="fr-card-body">
          {fields.length === 0 ? (
            <div className="farm-empty-state">
              <div style={{ fontSize: 48 }}>🌾</div>
              <p>{t("No fields added yet")}</p>
            </div>
          ) : (
            <div className="farm-fields-grid">
              {fields.map((field) => (
                <div key={field._id} className="farm-field-card">
                  <div className="farm-field-header">
                    <div
                      className="farm-field-color-indicator"
                      style={{ background: field.color || "#2A9D8F" }}
                    />
                    <div className="farm-field-title">
                      <div className="farm-field-name">{field.name}</div>
                      <div className="farm-field-area">
                        {field.area} {t("acres")} • {field.soilType}
                      </div>
                    </div>
                    <div
                      className="farm-status-badge"
                      style={{ color: getStatusColor(field.status) }}
                    >
                      {getStatusText(field.status)}
                    </div>
                  </div>

                  {field.cropId ? (
                    <div className="farm-crop-section">
                      <div className="farm-crop-icon">
                        {"🌱"}
                      </div>
                      <div className="farm-crop-info">
                        <div className="farm-crop-label">
                          {t("Current Crop")}
                        </div>
                        <div className="farm-crop-name">
                          {field.cropId.cropName}
                        </div>
                      </div>
                      <button
                        className="farm-change-crop-btn"
                        onClick={() => handleSelectCropForField(field)}
                      >
                        ✏️
                      </button>
                    </div>
                  ) : (
                    <button
                      className="farm-no-crop-section"
                      onClick={() => handleSelectCropForField(field)}
                    >
                      <span style={{ fontSize: 20 }}>➕</span>
                      <span>{t("Plant a Crop")}</span>
                    </button>
                  )}

                  {field.cropId && field.status === "Growing" && (
                    <div className="farm-quick-actions">
                      <button
                        className="farm-action-btn"
                        onClick={() => handleOpenHarvestModal(field)}
                      >
                        🌽 {t("Harvest")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddFieldModal && (
        <div className="farm-modal-overlay">
          <div className="farm-modal-content">
            <div className="farm-modal-header">
              <h3>{t("Add New Field")}</h3>
              <button
                className="farm-modal-close"
                onClick={() => setShowAddFieldModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddField} className="farm-modal-body">
              <div className="fr-form-group">
                <label className="fr-label">{t("Field Name *")}</label>
                <input
                  className="fr-input"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  placeholder={t("e.g., North Field")}
                  required
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Area (acres) *")}</label>
                <input
                  className="fr-input"
                  type="number"
                  step="0.1"
                  value={newField.area}
                  onChange={(e) =>
                    setNewField({ ...newField, area: e.target.value })
                  }
                  placeholder={t("e.g., 5.5")}
                  required
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Field Location *")}</label>
                <button
                  type="button"
                  className="farm-map-preview"
                  onClick={() => {
                    setTempCoords(newField.coordinates);
                    setMapModalVisible(true);
                  }}
                >
                  {newField.coordinates ? (
                    <div className="farm-map-preview-selected">
                      📍 {t("Location Set")}
                    </div>
                  ) : (
                    <div className="farm-map-preview-placeholder">
                      🗺️ {t("Tap to set field location")}
                    </div>
                  )}
                </button>
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Soil Type")}</label>
                <input
                  className="fr-input"
                  value={newField.soilType}
                  onChange={(e) =>
                    setNewField({ ...newField, soilType: e.target.value })
                  }
                  placeholder={t("e.g., Loamy")}
                />
              </div>

              <button
                type="submit"
                className="fr-btn fr-btn-teal"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="fr-spinner" /> {t("Adding...")}
                  </>
                ) : (
                  t("Add Field")
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapModalVisible && (
        <div className="farm-modal-overlay">
          <div className="farm-modal-content farm-modal-map">
            <div className="farm-modal-header">
              <h3>{t("Select Field Location")}</h3>
              <button
                className="farm-modal-close"
                onClick={() => setMapModalVisible(false)}
              >
                ✕
              </button>
            </div>
            <div className="farm-map-container">
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{ lat: previewRegion.lat, lng: previewRegion.lng }}
                  zoom={previewRegion.zoom}
                  onClick={handleMapClick}
                  ref={mapRef}
                >
                  {tempCoords && (
                    <Marker
                      position={{ lat: tempCoords.lat, lng: tempCoords.lng }}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
              <button
                className="farm-gps-btn"
                onClick={getCurrentLocation}
                disabled={fetchingGps}
              >
                {fetchingGps ? "📍..." : "📍"}
              </button>
            </div>
            <div className="farm-modal-footer">
              <button
                className="fr-btn fr-btn-teal"
                onClick={confirmMapLocation}
              >
                {t("Confirm Location")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Crop Modal */}
      {showUpdateCropModal && (
        <div className="farm-modal-overlay">
          <div className="farm-modal-content">
            <div className="farm-modal-header">
              <h3>
                {t("Select Crop for")} {selectedField?.name}
              </h3>
              <button
                className="farm-modal-close"
                onClick={() => setShowUpdateCropModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateFieldCrop} className="farm-modal-body">
              <div className="farm-crop-options">
                {crops.map((crop) => (
                  <button
                    key={crop._id}
                    type="button"
                    className={`farm-crop-option ${
                      selectedCropId === crop._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedCropId(crop._id)}
                  >
                    <span className="farm-crop-option-icon">
                      {"🌱"}
                    </span>
                    <div className="farm-crop-option-info">
                      <div className="farm-crop-option-name">
                        {crop.cropName}
                      </div>
                      <div className="farm-crop-option-details">
                        {crop.season} • {crop.duration} •{" "}
                        {crop.waterRequirement} {t("Water")}
                      </div>
                    </div>
                    {selectedCropId === crop._id && <span>✓</span>}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="fr-btn fr-btn-teal"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="fr-spinner" /> {t("Planting...")}
                  </>
                ) : (
                  t("Plant Crop")
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Harvest Modal */}
      {showHarvestModal && (
        <div className="farm-modal-overlay">
          <div className="farm-modal-content">
            <div className="farm-modal-header">
              <h3>
                {t("Harvest")} {selectedField?.cropId?.cropName}
              </h3>
              <button
                className="farm-modal-close"
                onClick={() => setShowHarvestModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleHarvestCrop} className="farm-modal-body">
              <div className="fr-form-group">
                <label className="fr-label">{t("Quantity Harvested *")}</label>
                <input
                  className="fr-input"
                  type="number"
                  step="0.1"
                  value={harvestData.quantity}
                  onChange={(e) =>
                    setHarvestData({ ...harvestData, quantity: e.target.value })
                  }
                  placeholder="e.g., 50"
                  required
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Unit")}</label>
                <div className="farm-unit-row">
                  {["kg", "quintal", "ton"].map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      className={`farm-unit-btn ${
                        harvestData.unit === unit ? "selected" : ""
                      }`}
                      onClick={() => setHarvestData({ ...harvestData, unit })}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Storage Location")}</label>
                <input
                  className="fr-input"
                  value={harvestData.storageLocation}
                  onChange={(e) =>
                    setHarvestData({
                      ...harvestData,
                      storageLocation: e.target.value,
                    })
                  }
                  placeholder="e.g., Warehouse A"
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Notes")}</label>
                <textarea
                  className="fr-input"
                  value={harvestData.notes}
                  onChange={(e) =>
                    setHarvestData({ ...harvestData, notes: e.target.value })
                  }
                  placeholder="Any additional notes..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                className="fr-btn fr-btn-teal"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="fr-spinner" /> {t("Recording...")}
                  </>
                ) : (
                  t("Record Harvest")
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
