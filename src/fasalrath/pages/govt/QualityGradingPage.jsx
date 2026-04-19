// src/fasalrath/pages/govt/QualityGradingPage.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function QualityGradingPage() {
  const { employee, authFetch } = useGovtAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [searchLotId, setSearchLotId] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [gradingForm, setGradingForm] = useState({
    grade: "",
    moisture: "",
    foreignMatter: "",
    damagedGrains: "",
    discoloredGrains: "",
    weevilDamage: "",
    otherDefects: "",
    gradingNotes: "",
    rejectionReason: "",
    labName: "",
    labLocation: "",
    labCertificationNumber: "",
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/quality/govt/pending`);
      if (res.ok) {
        const data = await res.json();
        const filteredRequests = (data.requests || []).filter((request) => {
          return (
            !request.assignedOfficer || request.assignedOfficer === employee?._id
          );
        });
        setPendingRequests(filteredRequests);
      }

      const res2 = await authFetch(
        `${API_BASE_URL}/api/quality/govt/my-requests`
      );
      if (res2.ok) {
        const data = await res2.json();
        setMyRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert(t("Failed to load data"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLot = async () => {
    if (!searchLotId.trim()) {
      alert(t("Please enter a Lot ID"));
      return;
    }

    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/quality/govt/search/${searchLotId.trim()}`
      );

      if (res.ok) {
        const data = await res.json();
        if (
          data.request.assignedTo &&
          data.request.assignedTo !== employee?._id &&
          data.request.assignedTo?._id !== employee?._id
        ) {
          alert(t("This request is assigned to another inspector"));
          return;
        }
        setSelectedRequest(data.request);
        setShowSearchModal(false);
        setShowGradingModal(true);
      } else {
        const error = await res.json();
        alert(error.message || t("Request not found"));
      }
    } catch (error) {
      console.error("Search Error:", error);
      alert(t("Failed to search"));
    }
  };

  const handleAssignToMe = async (requestId) => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/quality/govt/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (res.ok) {
        alert(t("Inspection assigned to you"));
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || t("Failed to assign"));
      }
    } catch (error) {
      console.error("Assign Error:", error);
      alert(t("Network error"));
    }
  };

  const getCropCategory = (cropName) => {
    if (!cropName) return null;
    const normalizedName = cropName.toLowerCase();
    const cereals = ["wheat", "bajra", "barley", "jowar", "ragi"];
    const pulses = ["arhar", "masur", "lentil", "moong", "urad"];
    const rice = ["paddy", "rice"];
    const oils = [
      "sunflower",
      "soyabean",
      "rapeseed",
      "mustard",
      "niger",
      "groundnut",
      "safflower",
      "sesamum",
    ];

    if (cereals.some((crop) => normalizedName.includes(crop))) return "cereals";
    if (pulses.some((crop) => normalizedName.includes(crop))) return "pulses";
    if (rice.some((crop) => normalizedName.includes(crop))) return "rice";
    if (oils.some((crop) => normalizedName.includes(crop))) return "oils";
    return "miscellaneous";
  };

  const getGradesForCategory = (category) => {
    const gradeMapping = {
      cereals: ["1", "2", "3", "4", "Rejected"],
      pulses: ["Special", "Standard", "General", "Rejected"],
      rice: ["Special", "A", "Rejected"],
      oils: ["Good", "Fair", "Ghani Cake", "Rejected"],
      miscellaneous: ["1", "2", "3", "4", "Rejected"],
    };
    return gradeMapping[category] || ["1", "2", "3", "4", "Rejected"];
  };

  const handleOpenGrading = (request) => {
    setSelectedRequest(request);
    setGradingForm({
      grade: "",
      moisture: "",
      foreignMatter: "",
      damagedGrains: "",
      discoloredGrains: "",
      weevilDamage: "",
      otherDefects: "",
      gradingNotes: "",
      rejectionReason: "",
      labName: "",
      labLocation: "",
      labCertificationNumber: "",
    });
    setShowGradingModal(true);
  };

  const handleSubmitGrading = async () => {
    if (!gradingForm.grade) {
      alert(t("Please select a grade"));
      return;
    }

    if (gradingForm.grade === "Rejected" && !gradingForm.rejectionReason) {
      alert(t("Please provide a rejection reason"));
      return;
    }

    if (!gradingForm.labName || !gradingForm.labLocation) {
      alert(t("Please provide lab information"));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        grade: gradingForm.grade,
        qualityParams: {
          moisture: parseFloat(gradingForm.moisture) || null,
          foreignMatter: parseFloat(gradingForm.foreignMatter) || null,
          damagedGrains: parseFloat(gradingForm.damagedGrains) || null,
          discoloredGrains: parseFloat(gradingForm.discoloredGrains) || null,
          weevilDamage: parseFloat(gradingForm.weevilDamage) || null,
          otherDefects: gradingForm.otherDefects || null,
        },
        gradingNotes: gradingForm.gradingNotes,
        rejectionReason: gradingForm.rejectionReason,
        labName: gradingForm.labName,
        labLocation: gradingForm.labLocation,
        labCertificationNumber: gradingForm.labCertificationNumber,
      };

      const res = await authFetch(
        `${API_BASE_URL}/api/quality/govt/grade/${selectedRequest._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert(t("Grading submitted successfully"));
        setShowGradingModal(false);
        setSelectedRequest(null);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.message || t("Failed to submit grading"));
      }
    } catch (error) {
      console.error("Submit Grading Error:", error);
      alert(t("Network error"));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#2A9D8F";
      case "rejected":
        return "#E76F51";
      case "in-progress":
        return "#F4A261";
      default:
        return "#888";
    }
  };

  const renderRequestCard = (request, showActions = true) => {
    const isAssignedToOther =
      request.assignedTo &&
      request.assignedTo !== employee?._id &&
      request.assignedTo?._id !== employee?._id;

    if (isAssignedToOther) return null;

    return (
      <div key={request._id} style={styles.requestCard}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>
            <span style={styles.cardIcon}>🌾</span>
            <div style={styles.titleText}>
              <div style={styles.cropName}>{request.cropId?.cropName}</div>
              <div style={styles.farmerName}>
                {t("Farmer")}: {request.farmerId?.name || t("Unknown")}
              </div>
            </div>
          </div>
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(request.status),
            }}
          >
            <span style={styles.statusText}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>

        <div style={styles.cardDetails}>
          <div style={styles.detailRow}>
            <span>⚖️</span>
            <span style={styles.detailText}>
              {request.quantity} {request.unit}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span>📍</span>
            <span style={styles.detailText}>
              {request.fieldId?.name || t("Unknown Field")}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span>📅</span>
            <span style={styles.detailText}>
              {new Date(request.harvestDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {request.grade && (
          <div style={styles.gradeInfo}>
            <span style={styles.gradeLabel}>
              {t("Grade")}: {request.grade}
            </span>
            {request.certificateNumber && (
              <span style={styles.certNumber}>
                {t("Certificate")}: {request.certificateNumber}
              </span>
            )}
          </div>
        )}

        <div style={styles.cardFooter}>
          <span style={styles.lotId}>
            {t("Lot ID")}: {request.lotId}
          </span>
          {showActions && request.status === "pending" && (
            <button
              style={styles.assignButton}
              onClick={() => handleAssignToMe(request._id)}
            >
              {t("Assign to Me")}
            </button>
          )}
          {showActions && request.status === "in-progress" && !request.grade && (
            <button
              style={styles.gradeButton}
              onClick={() => handleOpenGrading(request)}
            >
              {t("Grade Now")}
            </button>
          )}
        </div>
      </div>
    );
  };

  const currentRequests =
    activeTab === "pending" ? pendingRequests : myRequests;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <div style={styles.loadingText}>{t("Loading")}</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>{t("Quality Grading")}</h1>
        <button
          style={styles.searchButton}
          onClick={() => setShowSearchModal(true)}
        >
          🔍
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "pending" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("pending")}
        >
          <span
            style={{
              ...styles.tabText,
              ...(activeTab === "pending" ? styles.tabTextActive : {}),
            }}
          >
            {t("Pending")} ({pendingRequests.length})
          </span>
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "my-requests" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("my-requests")}
        >
          <span
            style={{
              ...styles.tabText,
              ...(activeTab === "my-requests" ? styles.tabTextActive : {}),
            }}
          >
            {t("My Inspections")} ({myRequests.length})
          </span>
        </button>
      </div>

      <div style={styles.container}>
        {currentRequests.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <div style={styles.emptyText}>{t("No requests found")}</div>
          </div>
        ) : (
          currentRequests.map((request) => renderRequestCard(request))
        )}
      </div>

      {showSearchModal && (
        <SearchModal
          visible={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          searchLotId={searchLotId}
          setSearchLotId={setSearchLotId}
          handleSearchLot={handleSearchLot}
          t={t}
        />
      )}

      {showGradingModal && (
        <GradingModal
          visible={showGradingModal}
          onClose={() => setShowGradingModal(false)}
          selectedRequest={selectedRequest}
          gradingForm={gradingForm}
          setGradingForm={setGradingForm}
          handleSubmitGrading={handleSubmitGrading}
          submitting={submitting}
          getCropCategory={getCropCategory}
          getGradesForCategory={getGradesForCategory}
          t={t}
        />
      )}
    </div>
  );
}

function SearchModal({
  visible,
  onClose,
  searchLotId,
  setSearchLotId,
  handleSearchLot,
  t,
}) {
  if (!visible) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.searchModalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>{t("Search by Lot ID")}</h2>
        <input
          style={styles.searchInput}
          value={searchLotId}
          onChange={(e) => setSearchLotId(e.target.value)}
          placeholder={t("Enter Lot ID")}
        />
        <div style={styles.searchActions}>
          <button style={styles.cancelButton} onClick={onClose}>
            {t("Cancel")}
          </button>
          <button style={styles.searchActionButton} onClick={handleSearchLot}>
            {t("Search")}
          </button>
        </div>
      </div>
    </div>
  );
}

function GradingModal({
  visible,
  onClose,
  selectedRequest,
  gradingForm,
  setGradingForm,
  handleSubmitGrading,
  submitting,
  getCropCategory,
  getGradesForCategory,
  t,
}) {
  if (!visible) return null;

  const cropCategory = selectedRequest?.cropId?.cropName
    ? getCropCategory(selectedRequest.cropId.cropName)
    : "miscellaneous";

  const availableGrades = getGradesForCategory(cropCategory);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{t("Quality Grading")}</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.modalBody}>
          {selectedRequest && (
            <>
              <div style={styles.requestInfo}>
                <div style={styles.infoTitle}>{t("Request Details")}</div>
                <div style={styles.infoText}>
                  {t("Crop")}: {selectedRequest.cropId?.cropName}
                </div>
                <div style={styles.infoText}>
                  {t("Category")}:{" "}
                  {cropCategory.charAt(0).toUpperCase() + cropCategory.slice(1)}
                </div>
                <div style={styles.infoText}>
                  {t("Quantity")}: {selectedRequest.quantity}{" "}
                  {selectedRequest.unit}
                </div>
                <div style={styles.infoText}>
                  {t("Field")}: {selectedRequest.fieldId?.name}
                </div>
                <div style={styles.infoText}>
                  {t("Farmer")}:{" "}
                  {selectedRequest.farmerId?.name || t("Not Available")}
                </div>
                <div style={styles.infoText}>
                  {t("Phone")}:{" "}
                  {selectedRequest.farmerId?.phone || t("Not Available")}
                </div>
              </div>

              <div style={styles.sectionTitle}>{t("Lab Information")}</div>
              <FormInput
                label={t("Lab Name")}
                value={gradingForm.labName}
                onChange={(text) =>
                  setGradingForm({ ...gradingForm, labName: text })
                }
                placeholder={t("Enter lab name")}
              />
              <FormInput
                label={t("Lab Location")}
                value={gradingForm.labLocation}
                onChange={(text) =>
                  setGradingForm({ ...gradingForm, labLocation: text })
                }
                placeholder={t("Enter lab location")}
              />
              <FormInput
                label={t("Lab Certification Number")}
                value={gradingForm.labCertificationNumber}
                onChange={(text) =>
                  setGradingForm({
                    ...gradingForm,
                    labCertificationNumber: text,
                  })
                }
                placeholder={t("Enter certification number")}
              />

              <div style={styles.inputGroup}>
                <div style={styles.inputLabel}>{t("Select Grade")}</div>
                <div style={styles.gradeOptions}>
                  {availableGrades.map((grade) => (
                    <button
                      key={grade}
                      style={{
                        ...styles.gradeOption,
                        ...(gradingForm.grade === grade
                          ? styles.gradeOptionSelected
                          : {}),
                      }}
                      onClick={() =>
                        setGradingForm({ ...gradingForm, grade })
                      }
                    >
                      <span
                        style={{
                          ...styles.gradeOptionText,
                          ...(gradingForm.grade === grade
                            ? styles.gradeOptionTextSelected
                            : {}),
                        }}
                      >
                        {grade}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.sectionTitle}>{t("Quality Parameters")}</div>
              <div style={styles.paramRow}>
                <FormInput
                  label={t("Moisture")}
                  value={gradingForm.moisture}
                  onChange={(text) =>
                    setGradingForm({ ...gradingForm, moisture: text })
                  }
                  type="number"
                  placeholder="0.0"
                  small
                />
                <FormInput
                  label={t("Foreign Matter")}
                  value={gradingForm.foreignMatter}
                  onChange={(text) =>
                    setGradingForm({ ...gradingForm, foreignMatter: text })
                  }
                  type="number"
                  placeholder="0.0"
                  small
                />
              </div>

              <div style={styles.paramRow}>
                <FormInput
                  label={t("Damaged Grains")}
                  value={gradingForm.damagedGrains}
                  onChange={(text) =>
                    setGradingForm({ ...gradingForm, damagedGrains: text })
                  }
                  type="number"
                  placeholder="0.0"
                  small
                />
                <FormInput
                  label={t("Discolored")}
                  value={gradingForm.discoloredGrains}
                  onChange={(text) =>
                    setGradingForm({ ...gradingForm, discoloredGrains: text })
                  }
                  type="number"
                  placeholder="0.0"
                  small
                />
              </div>

              <FormInput
                label={t("Weevil Damage")}
                value={gradingForm.weevilDamage}
                onChange={(text) =>
                  setGradingForm({ ...gradingForm, weevilDamage: text })
                }
                type="number"
                placeholder="0.0"
              />

              <FormInput
                label={t("Other Defects")}
                value={gradingForm.otherDefects}
                onChange={(text) =>
                  setGradingForm({ ...gradingForm, otherDefects: text })
                }
                placeholder={t("Describe any other defects")}
                multiline
              />

              <FormInput
                label={t("Grading Notes")}
                value={gradingForm.gradingNotes}
                onChange={(text) =>
                  setGradingForm({ ...gradingForm, gradingNotes: text })
                }
                placeholder={t("Additional notes")}
                multiline
              />

              {gradingForm.grade === "Rejected" && (
                <FormInput
                  label={t("Rejection Reason")}
                  value={gradingForm.rejectionReason}
                  onChange={(text) =>
                    setGradingForm({ ...gradingForm, rejectionReason: text })
                  }
                  placeholder={t("Explain why the crop is being rejected")}
                  multiline
                />
              )}

              <button
                style={{
                  ...styles.submitButton,
                  opacity: submitting ? 0.6 : 1,
                }}
                onClick={handleSubmitGrading}
                disabled={submitting}
              >
                {submitting ? t("Submitting") : t("Submit Grading")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  placeholder = "",
  small = false,
}) {
  return (
    <div style={small ? styles.inputGroupSmall : styles.inputGroup}>
      <div style={styles.inputLabel}>{label}</div>
      {multiline ? (
        <textarea
          style={{ ...styles.input, ...styles.textArea }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          style={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
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
  searchButton: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    backgroundColor: "#F0F2E6",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  tabs: {
    display: "flex",
    backgroundColor: "#FFF",
    borderBottom: "1px solid #E0E0E0",
  },
  tab: {
    flex: 1,
    padding: "16px",
    background: "none",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
  },
  tabActive: {
    borderBottomColor: "#606C38",
  },
  tabText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  tabTextActive: {
    color: "#606C38",
  },
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #606C38",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "10px",
    color: "#666",
  },
  requestCard: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    fontSize: "24px",
    marginRight: "12px",
  },
  titleText: {
    flex: 1,
  },
  cropName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#264653",
  },
  farmerName: {
    fontSize: "14px",
    color: "#666",
    marginTop: "2px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "12px",
  },
  statusText: {
    color: "#FFF",
    fontSize: "12px",
    fontWeight: "600",
  },
  cardDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "12px",
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  detailText: {
    fontSize: "14px",
    color: "#666",
  },
  gradeInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #F0F0F0",
    marginBottom: "8px",
  },
  gradeLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#2A9D8F",
  },
  certNumber: {
    fontSize: "12px",
    color: "#666",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lotId: {
    fontSize: "12px",
    color: "#888",
    fontFamily: "monospace",
  },
  assignButton: {
    backgroundColor: "#606C38",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    color: "#FFF",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  gradeButton: {
    backgroundColor: "#2A9D8F",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    color: "#FFF",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    paddingTop: "60px",
  },
  emptyIcon: {
    fontSize: "64px",
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#666",
    marginTop: "16px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  searchModalContent: {
    backgroundColor: "#FFF",
    borderRadius: "16px",
    padding: "24px",
    width: "85%",
    maxWidth: "500px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#264653",
    marginBottom: "16px",
    margin: 0,
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  searchActions: {
    display: "flex",
    gap: "12px",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    color: "#666",
    cursor: "pointer",
  },
  searchActionButton: {
    flex: 1,
    backgroundColor: "#606C38",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    color: "#FFF",
    cursor: "pointer",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: "24px",
    width: "95%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #E0E0E0",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
  },
  modalBody: {
    padding: "20px",
    overflowY: "auto",
    flex: 1,
  },
  requestInfo: {
    backgroundColor: "#F0F2E6",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#264653",
    marginBottom: "8px",
  },
  infoText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "4px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  inputGroupSmall: {
    marginBottom: "12px",
    flex: 1,
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  textArea: {
    minHeight: "80px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  gradeOptions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  gradeOption: {
    flex: "1 1 auto",
    minWidth: "60px",
    backgroundColor: "#F8F9FA",
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #E0E0E0",
    cursor: "pointer",
  },
  gradeOptionSelected: {
    backgroundColor: "#606C38",
    borderColor: "#606C38",
  },
  gradeOptionText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#666",
  },
  gradeOptionTextSelected: {
    color: "#FFF",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#264653",
    marginBottom: "12px",
    marginTop: "20px",
  },
  paramRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#606C38",
    color: "#FFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px",
  },
};
