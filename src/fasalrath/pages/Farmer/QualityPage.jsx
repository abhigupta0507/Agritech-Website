import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import "../../styles/quality.css";

export default function QualityPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/quality/farmer/requests`,
      );

      if (res.ok) {
        const data = await res.json();
        let filteredRequests = data.requests || [];

        if (filter !== "all") {
          filteredRequests = filteredRequests.filter(
            (r) => r.status === filter,
          );
        }

        setRequests(filteredRequests);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert(t("Failed to load quality requests"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleViewDetails = async (request) => {
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/quality/farmer/request/${request._id}`,
      );

      if (res.ok) {
        const data = await res.json();
        setSelectedRequest(data.request);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Fetch Details Error:", error);
      alert(t("Failed to load details"));
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      approved: "#4CAF50",
      rejected: "#E76F51",
      "in-progress": "#F4A261",
      pending: "#457B9D",
    };
    return colorMap[status] || "#888";
  };

  const getGradeColor = (grade) => {
    const colorMap = {
      FAQ: "#2A9D8F",
      A: "#4CAF50",
      B: "#F4A261",
      C: "#FF9800",
    };
    return colorMap[grade] || "#888";
  };

  if (loading && !refreshing) {
    return (
      <div className="quality-page-loading">
        <div className="fr-spinner fr-spinner-teal" />
      </div>
    );
  }

  return (
    <div className="quality-page-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("Quality Certificates")}</span>
        </div>
        <div className="fr-page-title">📜 {t("Quality Certificates")}</div>
      </div>

      <div className="quality-filter-bar">
        <button
          className={`quality-filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {t("All")}
        </button>
        <button
          className={`quality-filter-btn ${
            filter === "pending" ? "active" : ""
          }`}
          onClick={() => setFilter("pending")}
        >
          {t("Pending")}
        </button>
        <button
          className={`quality-filter-btn ${
            filter === "approved" ? "active" : ""
          }`}
          onClick={() => setFilter("approved")}
        >
          {t("Approved")}
        </button>
        <button
          className={`quality-filter-btn ${
            filter === "rejected" ? "active" : ""
          }`}
          onClick={() => setFilter("rejected")}
        >
          {t("Rejected")}
        </button>
      </div>

      <div className="quality-stats-grid">
        <div className="quality-stat-card">
          <div className="quality-stat-value">{requests.length}</div>
          <div className="quality-stat-label">{t("Total")}</div>
        </div>
        <div className="quality-stat-card">
          <div className="quality-stat-value" style={{ color: "#4CAF50" }}>
            {requests.filter((r) => r.status === "approved").length}
          </div>
          <div className="quality-stat-label">{t("Approved")}</div>
        </div>
        <div className="quality-stat-card">
          <div className="quality-stat-value" style={{ color: "#457B9D" }}>
            {requests.filter((r) => r.status === "pending").length}
          </div>
          <div className="quality-stat-label">{t("Pending")}</div>
        </div>
        <div className="quality-stat-card">
          <div className="quality-stat-value" style={{ color: "#F4A261" }}>
            {requests.filter((r) => r.status === "in-progress").length}
          </div>
          <div className="quality-stat-label">{t("In Progress")}</div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="quality-empty-state">
          <div style={{ fontSize: 48 }}>📜</div>
          <p>
            {filter === "all"
              ? t("No quality requests yet")
              : `${t("No")} ${t(filter)} ${t("requests")}`}
          </p>
          <p className="quality-empty-subtext">
            {t("Go to My Harvest to request quality inspection")}
          </p>
          <button
            className="fr-btn fr-btn-teal"
            onClick={() => navigate("/fasalrath/harvest")}
            style={{ width: "auto", marginTop: 20 }}
          >
            {t("View My Harvest")}
          </button>
        </div>
      ) : (
        <div className="quality-requests-grid">
          {requests.map((request) => (
            <div
              key={request._id}
              className="quality-request-card"
              onClick={() => handleViewDetails(request)}
            >
              <div className="quality-card-header">
                <div className="quality-card-title">
                  <span className="quality-crop-icon">
                    {request.cropId?.icon || "🌱"}
                  </span>
                  <div>
                    <div className="quality-crop-name">
                      {request.cropId?.cropName || t("Unknown Crop")}
                    </div>
                    <div className="quality-field-name">
                      {request.fieldId?.name || t("Unknown Field")}
                    </div>
                  </div>
                </div>
                <div
                  className="quality-status-badge"
                  style={{ background: getStatusColor(request.status) }}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1).replace("-", " ")}
                </div>
              </div>

              <div className="quality-card-details">
                <div className="quality-detail-row">
                  ⚖️ {request.quantity} {request.unit}
                </div>
                <div className="quality-detail-row">
                  📅 {new Date(request.harvestDate).toLocaleDateString()}
                </div>
                {request.storageLocation && (
                  <div className="quality-detail-row">
                    🏭 {request.storageLocation}
                  </div>
                )}
              </div>

              {request.grade && request.status === "approved" && (
                <div className="quality-grade-section">
                  <div
                    className="quality-grade-badge"
                    style={{ background: getGradeColor(request.grade) }}
                  >
                    {t("Grade")}: {request.grade}
                  </div>
                  {request.certificateNumber && (
                    <div className="quality-cert-number">
                      {request.certificateNumber}
                    </div>
                  )}
                </div>
              )}

              {request.status === "in-progress" && (
                <div className="quality-status-info">
                  <span>⏳</span>
                  <span>{t("Inspection in progress")}</span>
                </div>
              )}

              {request.status === "pending" && (
                <div className="quality-status-info">
                  <span>⏰</span>
                  <span>{t("Awaiting assignment")}</span>
                </div>
              )}

              <div className="quality-card-footer">
                <div className="quality-lot-id">
                  {t("ID")}: {request._id.slice(-8)}
                </div>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="quality-modal-overlay">
          <div className="quality-modal-content">
            <div className="quality-modal-header">
              <h3>{t("Certificate Details")}</h3>
              <button
                className="quality-modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="quality-modal-body">
              {selectedRequest.status === "approved" &&
                selectedRequest.certificateQRCode && (
                  <div className="quality-certificate-section">
                    <img
                      src={selectedRequest.certificateQRCode}
                      alt="QR Code"
                      className="quality-qr-code"
                    />
                    <div className="quality-certificate-number">
                      {selectedRequest.certificateNumber}
                    </div>
                    <div
                      className="quality-large-grade-badge"
                      style={{
                        background: getGradeColor(selectedRequest.grade),
                      }}
                    >
                      {t("Grade")}: {selectedRequest.grade}
                    </div>
                  </div>
                )}

              <div className="quality-details-section">
                <h4 className="quality-section-title">
                  {t("Request Information")}
                </h4>
                <div className="quality-detail-row-container">
                  <span className="quality-detail-label">{t("Crop")}:</span>
                  <span className="quality-detail-value">
                    {selectedRequest.cropId?.cropName || t("N/A")}
                  </span>
                </div>
                <div className="quality-detail-row-container">
                  <span className="quality-detail-label">{t("Quantity")}:</span>
                  <span className="quality-detail-value">
                    {selectedRequest.quantity} {selectedRequest.unit}
                  </span>
                </div>
                <div className="quality-detail-row-container">
                  <span className="quality-detail-label">{t("Field")}:</span>
                  <span className="quality-detail-value">
                    {selectedRequest.fieldId?.name || t("N/A")}
                  </span>
                </div>
                <div className="quality-detail-row-container">
                  <span className="quality-detail-label">
                    {t("Harvest Date")}:
                  </span>
                  <span className="quality-detail-value">
                    {new Date(selectedRequest.harvestDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="quality-detail-row-container">
                  <span className="quality-detail-label">{t("Status")}:</span>
                  <span className="quality-detail-value">
                    {selectedRequest.status.toUpperCase()}
                  </span>
                </div>
                {selectedRequest.storageLocation && (
                  <div className="quality-detail-row-container">
                    <span className="quality-detail-label">
                      {t("Storage")}:
                    </span>
                    <span className="quality-detail-value">
                      {selectedRequest.storageLocation}
                    </span>
                  </div>
                )}
              </div>

              {selectedRequest.labName && (
                <div className="quality-details-section">
                  <h4 className="quality-section-title">
                    {t("Laboratory Details")}
                  </h4>
                  <div className="quality-detail-row-container">
                    <span className="quality-detail-label">
                      {t("Lab Name")}:
                    </span>
                    <span className="quality-detail-value">
                      {selectedRequest.labName}
                    </span>
                  </div>
                  {selectedRequest.labLocation && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Location")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.labLocation}
                      </span>
                    </div>
                  )}
                  {selectedRequest.labCertificationNumber && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Cert Number")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.labCertificationNumber}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.assignedOfficer && (
                <div className="quality-details-section">
                  <h4 className="quality-section-title">
                    {t("Inspector Details")}
                  </h4>
                  <div className="quality-detail-row-container">
                    <span className="quality-detail-label">{t("Name")}:</span>
                    <span className="quality-detail-value">
                      {selectedRequest.assignedOfficer.name || t("N/A")}
                    </span>
                  </div>
                  {selectedRequest.assignedOfficer.employeeId && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Employee ID")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.assignedOfficer.employeeId}
                      </span>
                    </div>
                  )}
                  {selectedRequest.inspectionDate && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Inspection Date")}:
                      </span>
                      <span className="quality-detail-value">
                        {new Date(
                          selectedRequest.inspectionDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.qualityParams && (
                <div className="quality-details-section quality-params-section">
                  <h4 className="quality-section-title">
                    {t("Quality Parameters")}
                  </h4>
                  {selectedRequest.qualityParams.moisture && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Moisture")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.qualityParams.moisture}%
                      </span>
                    </div>
                  )}
                  {selectedRequest.qualityParams.foreignMatter && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Foreign Matter")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.qualityParams.foreignMatter}%
                      </span>
                    </div>
                  )}
                  {selectedRequest.qualityParams.damagedGrains && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Damaged Grains")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.qualityParams.damagedGrains}%
                      </span>
                    </div>
                  )}
                  {selectedRequest.qualityParams.discoloredGrains && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Discolored Grains")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.qualityParams.discoloredGrains}%
                      </span>
                    </div>
                  )}
                  {selectedRequest.qualityParams.weevilDamage && (
                    <div className="quality-detail-row-container">
                      <span className="quality-detail-label">
                        {t("Weevil Damage")}:
                      </span>
                      <span className="quality-detail-value">
                        {selectedRequest.qualityParams.weevilDamage}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.gradingNotes && (
                <div className="quality-details-section quality-notes-section">
                  <h4 className="quality-section-title">
                    {t("Inspector Notes")}
                  </h4>
                  <p className="quality-notes-text">
                    {selectedRequest.gradingNotes}
                  </p>
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="quality-details-section quality-rejection-section">
                  <h4 className="quality-section-title">
                    {t("Rejection Reason")}
                  </h4>
                  <p className="quality-rejection-text">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
