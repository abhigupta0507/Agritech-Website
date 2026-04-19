// src/fasalrath/pages/govt/CompleteProfilePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";
import { uploadMultipleDocuments } from "../../../utils/uploadUtils"

export default function GovtCompleteProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employee, authFetch, updateEmployeeLocal } = useGovtAuth();

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: employee?.phone || "",
    homeAddress: "",
    maritalStatus: "single",
    accountNumber: "",
    IFSCCode: "",
  });
  const [documents, setDocuments] = useState({
    idProof: null,
    addressProof: null,
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const handleFileSelect = (documentType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setErrors((er) => ({
        ...er,
        [documentType]: t("Please upload a PDF file"),
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((er) => ({
        ...er,
        [documentType]: t("File size must be less than 5MB"),
      }));
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [documentType]: file,
    }));
    setErrors((er) => ({ ...er, [documentType]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Name is required");
    if (!form.email.trim()) {
      errs.email = t("Email is required");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email))
        errs.email = t("Please enter a valid email address");
    }

    if (!documents.idProof) {
      errs.idProof = t("ID Proof is required");
    }
    if (!documents.addressProof) {
      errs.addressProof = t("Address Proof is required");
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Upload documents to Firebase Storage
      const documentUrls = await uploadMultipleDocuments(
        documents,
        employee?.id || employee?.phone,

        (progress) => {
          setUploadProgress(progress);
        },
      );

      // Submit profile with document URLs
      const res = await authFetch(
        `${API_BASE_URL}/api/govt/auth/complete-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            phone: `+91${form.phone}`,
            documents: documentUrls,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || t("Failed to complete profile"));
      }

      const data = await res.json();
      updateEmployeeLocal({
        ...data.employee,
        profileComplete: true,
        verificationStatus: "pending",
      });

      alert(
        t(
          "Profile submitted for verification. You will be notified once approved.",
        ),
      );

      navigate("/fasalrath/govt/verification-pending", { replace: true });
    } catch (err) {
      alert(err.message || t("Failed to complete profile"));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fr-auth-page fr-fade-in">
      <div className="fr-auth-card fr-slide-up" style={{ maxWidth: 650 }}>
        <div className="fr-auth-card-header">
          <div className="fr-auth-logo-mark" style={{ background: "#606C38" }}>
            📋
          </div>
          <div className="fr-auth-title">{t("Complete Your Profile")}</div>
          <div className="fr-auth-subtitle">
            {t("Please provide your details and upload required documents")}
          </div>
        </div>

        <div className="fr-auth-body">
          <div className="fr-alert fr-alert-info">
            <span>ℹ️</span>
            <span>
              {t("Your profile will be reviewed by an administrator")}
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Personal Information Section */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#264653",
                  marginBottom: 16,
                }}
              >
                {t("Personal Information")}
              </h3>

              <div className="fr-form-group">
                <label className="fr-label">{t("Full Name")} *</label>
                <input
                  className={`fr-input ${errors.name ? "error" : ""}`}
                  value={form.name}
                  onChange={set("name")}
                  placeholder={t("Enter your full name")}
                />
                {errors.name && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.name}
                  </div>
                )}
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Email Address")} *</label>
                <input
                  className={`fr-input ${errors.email ? "error" : ""}`}
                  value={form.email}
                  onChange={set("email")}
                  type="email"
                  placeholder={t("Enter your email")}
                  autoCapitalize="none"
                />
                {errors.email && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.email}
                  </div>
                )}
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Home Address")}</label>
                <textarea
                  className="fr-input"
                  value={form.homeAddress}
                  onChange={set("homeAddress")}
                  placeholder={t("Enter your address")}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Phone")}</label>
                <input
                  className="fr-input"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder={t("Enter your Phone number")}
                  inputMode="numeric"
                 
                />
              </div>
              <div className="fr-form-group">
                <label className="fr-label">{t("Marital Status")}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {["single", "married", "divorced", "widowed"].map(
                    (status) => (
                      <label
                        key={status}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="maritalStatus"
                          value={status}
                          checked={form.maritalStatus === status}
                          onChange={() =>
                            setForm((f) => ({ ...f, maritalStatus: status }))
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <span style={{ fontSize: 14 }}>
                          {t(status.charAt(0).toUpperCase() + status.slice(1))}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#264653",
                  marginBottom: 16,
                }}
              >
                {t("Bank Details")}
              </h3>

              <div className="fr-form-group">
                <label className="fr-label">{t("Account Number")}</label>
                <input
                  className="fr-input"
                  value={form.accountNumber}
                  onChange={set("accountNumber")}
                  placeholder={t("Enter account number")}
                  inputMode="numeric"
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("IFSC Code")}</label>
                <input
                  className="fr-input"
                  value={form.IFSCCode}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      IFSCCode: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder={t("Enter IFSC code")}
                />
              </div>
            </div>

            {/* Required Documents Section */}
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#264653",
                  marginBottom: 8,
                }}
              >
                {t("Required Documents")}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "#666",
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                {t(
                  "Please upload clear PDF copies of the following documents (Max 5MB each)",
                )}
              </p>

              {/* ID Proof Upload */}
              <div className="fr-form-group">
                <label className="fr-label">{t("ID Proof")} *</label>
                <div
                  style={{
                    position: "relative",
                    border: documents.idProof
                      ? "2px solid #2A9D8F"
                      : "2px dashed #E0E0E0",
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: documents.idProof ? "#E8F5F3" : "#F0F2E6",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() =>
                    document.getElementById("idProofInput").click()
                  }
                >
                  <input
                    id="idProofInput"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileSelect("idProof", e)}
                    style={{ display: "none" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {documents.idProof ? "✅" : "📄"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: documents.idProof ? "#2A9D8F" : "#606C38",
                          fontWeight: 500,
                        }}
                      >
                        {documents.idProof
                          ? documents.idProof.name
                          : t("Choose File")}
                      </div>
                      {documents.idProof && (
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {(documents.idProof.size / 1024).toFixed(2)} KB
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {errors.idProof && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.idProof}
                  </div>
                )}
              </div>

              {/* Address Proof Upload */}
              <div className="fr-form-group">
                <label className="fr-label">{t("Address Proof")} *</label>
                <div
                  style={{
                    position: "relative",
                    border: documents.addressProof
                      ? "2px solid #2A9D8F"
                      : "2px dashed #E0E0E0",
                    borderRadius: 8,
                    padding: 16,
                    backgroundColor: documents.addressProof
                      ? "#E8F5F3"
                      : "#F0F2E6",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() =>
                    document.getElementById("addressProofInput").click()
                  }
                >
                  <input
                    id="addressProofInput"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileSelect("addressProof", e)}
                    style={{ display: "none" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>
                      {documents.addressProof ? "✅" : "📄"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: documents.addressProof ? "#2A9D8F" : "#606C38",
                          fontWeight: 500,
                        }}
                      >
                        {documents.addressProof
                          ? documents.addressProof.name
                          : t("Choose File")}
                      </div>
                      {documents.addressProof && (
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {(documents.addressProof.size / 1024).toFixed(2)} KB
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {errors.addressProof && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.addressProof}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div
                style={{
                  marginBottom: 20,
                  padding: 16,
                  backgroundColor: "#F0F2E6",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: "#606C38",
                    fontWeight: 600,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {t("Uploading documents")}: {uploadProgress}%
                </div>
                <div
                  style={{
                    height: 8,
                    backgroundColor: "#E0E0E0",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${uploadProgress}%`,
                      backgroundColor: "#606C38",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="fr-btn fr-btn-teal"
              disabled={loading}
              style={{ background: "#606C38" }}
            >
              {loading ? (
                <>
                  <div className="fr-spinner" />{" "}
                  {uploadProgress > 0 ? t("Uploading...") : t("Submitting...")}
                </>
              ) : (
                t("Submit for Verification")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
