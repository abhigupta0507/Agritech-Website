// src/fasalrath/pages/govt/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function GovtProfilePage() {
  const { employee, authFetch, updateEmployeeLocal, logout } = useGovtAuth();
  const { t } = useTranslation();
  const [localUser, setLocalUser] = useState(employee || {});
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/govt/auth/profile`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || t("Failed to fetch profile"));
      }

      const profileData = data?.employee || data?.user || {};
      setLocalUser(profileData);
      updateEmployeeLocal(profileData);
    } catch (error) {
      console.error("Fetch profile error:", error);
      alert(t("Unable to load profile Please try again"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <div style={styles.loadingText}>{t("Loading profile")}</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>{t("Profile and Settings")}</h1>
      </div>

      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              <span style={styles.avatarIcon}>🏛️</span>
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>
                {localUser?.name || t("Government Officer")}
              </div>
              <div style={styles.profileEmail}>
                {localUser?.email || localUser?.phone || t("Not Available")}
              </div>
            </div>
          </div>

          <div style={styles.details}>
            {localUser?.employeeId && (
              <DetailRow
                label={t("Employee ID")}
                value={localUser.employeeId}
              />
            )}
            <DetailRow
              label={t("Department")}
              value={localUser?.department || t("Not Available")}
            />
            <DetailRow
              label={t("Designation")}
              value={localUser?.designation || t("MSP Compliance")}
            />
            <DetailRow
              label={t("Phone")}
              value={localUser?.phone || t("Not Available")}
            />
            {localUser?.homeAddress && (
              <DetailRow
                label={t("Home Address")}
                value={localUser.homeAddress}
              />
            )}
            {localUser?.maritalStatus && (
              <DetailRow
                label={t("Marital Status")}
                value={localUser.maritalStatus}
              />
            )}
            {localUser?.accountNumber && (
              <DetailRow
                label={t("Account Number")}
                value={localUser.accountNumber}
              />
            )}
            {localUser?.IFSCCode && (
              <DetailRow label={t("IFSC Code")} value={localUser.IFSCCode} />
            )}
          </div>

          <button
            style={styles.editButton}
            onClick={() => setEditVisible(true)}
          >
            <span style={styles.editButtonText}>{t("Edit Profile")}</span>
            <span style={styles.editIcon}>✏️</span>
          </button>
        </div>

        <div style={styles.signOutContainer}>
          <button style={styles.signOutButton} onClick={logout}>
            {t("Sign Out")}
          </button>
        </div>
      </div>

      {editVisible && (
        <EditProfileModal
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          user={localUser}
          onSaved={(updated) => {
            setLocalUser((prev) => ({ ...prev, ...updated }));
            updateEmployeeLocal(updated);
            fetchProfile();
          }}
        />
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}:</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  );
}

function EditProfileModal({ visible, onClose, user, onSaved }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const { authFetch } = useGovtAuth();
  const { t } = useTranslation();

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      homeAddress: user?.homeAddress || "",
      maritalStatus: user?.maritalStatus || "",
      accountNumber: user?.accountNumber || "",
      IFSCCode: user?.IFSCCode || "",
      employeeId: user?.employeeId || "",
    });
  }, [user, visible]);

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    if (!form.name) {
      alert(t("Name is required"));
      return;
    }

    if (form.email && form.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        alert(t("Please enter a valid email address"));
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {};
      Object.keys(form).forEach((key) => {
        if (form[key] && form[key].toString().trim() !== "") {
          payload[key] = form[key].toString().trim();
        }
      });

      const resp = await authFetch(
        `${API_BASE_URL}/api/govt/auth/update-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        alert(data?.message || t("Failed to update profile"));
        return;
      }

      const updated = data?.employee || data?.user || payload;
      alert(t("Profile updated successfully"));
      onSaved(updated);
      onClose();
    } catch (err) {
      console.error("EditProfileModal save error", err);
      alert(t("Unable to update profile Please check your connection"));
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{t("Edit Profile")}</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.infoBanner}>
          <span>ℹ️</span>
          <span style={styles.infoBannerText}>
            {t("Department and Designation are managed by administration")}
          </span>
        </div>

        <div style={styles.formScroll}>
          <LabelInput
            label={t("Full Name")}
            value={form.name}
            onChange={(v) => updateField("name", v)}
            placeholder={t("Enter your full name")}
          />
          <LabelInput
            label={t("Email")}
            value={form.email}
            onChange={(v) => updateField("email", v)}
            type="email"
            placeholder={t("Enter email address")}
          />
          <LabelInput
            label={t("Phone")}
            value={form.phone}
            onChange={(v) => updateField("phone", v)}
            type="tel"
            placeholder={t("Enter phone number")}
            disabled
          />
          <LabelInput
            label={t("Home Address")}
            value={form.homeAddress}
            onChange={(v) => updateField("homeAddress", v)}
            multiline
            placeholder={t("Enter your home address")}
          />
          <LabelInput
            label={t("Marital Status")}
            value={form.maritalStatus}
            onChange={(v) => updateField("maritalStatus", v)}
            placeholder={t("Enter marital status")}
          />
          <LabelInput
            label={t("Account Number")}
            value={form.accountNumber}
            onChange={(v) => updateField("accountNumber", v)}
            type="number"
            placeholder={t("Enter bank account number")}
          />
          <LabelInput
            label={t("IFSC Code")}
            value={form.IFSCCode}
            onChange={(v) => updateField("IFSCCode", v)}
            placeholder={t("Enter IFSC code")}
          />

          <button
            style={{
              ...styles.saveButton,
              opacity: loading ? 0.6 : 1,
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? t("Saving") : t("Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
}

function LabelInput({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  placeholder = "",
  disabled = false,
}) {
  return (
    <div style={styles.inputContainer}>
      <label style={styles.inputLabel}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...styles.input,
            ...styles.inputMultiline,
            ...(disabled ? styles.inputDisabled : {}),
          }}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...styles.input,
            ...(disabled ? styles.inputDisabled : {}),
          }}
          placeholder={placeholder}
          disabled={disabled}
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
    marginTop: "12px",
    fontSize: "16px",
    color: "#666",
  },
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "30px",
    backgroundColor: "#F0F2E6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarIcon: {
    fontSize: "30px",
  },
  profileInfo: {
    marginLeft: "16px",
    flex: 1,
  },
  profileName: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#264653",
  },
  profileEmail: {
    fontSize: "16px",
    color: "#666",
    marginTop: "4px",
  },
  details: {
    marginTop: "16px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #F0F0F0",
  },
  infoLabel: {
    fontSize: "14px",
    color: "#666",
    width: "140px",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#264653",
    marginLeft: "8px",
    flex: 1,
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
  editButtonText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#606C38",
    marginRight: "6px",
  },
  editIcon: {
    fontSize: "14px",
  },
  signOutContainer: {
    marginTop: "16px",
    marginBottom: "40px",
  },
  signOutButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#E76F51",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#264653",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
    padding: "4px",
  },
  infoBanner: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F0F2E6",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    gap: "8px",
  },
  infoBannerText: {
    fontSize: "12px",
    color: "#606C38",
    flex: 1,
  },
  formScroll: {
    overflowY: "auto",
    flex: 1,
  },
  inputContainer: {
    marginBottom: "16px",
  },
  inputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#E6E6E6",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: "#FAFAFA",
    fontSize: "15px",
    color: "#264653",
    boxSizing: "border-box",
  },
  inputMultiline: {
    minHeight: "80px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  inputDisabled: {
    backgroundColor: "#F0F0F0",
    color: "#999",
    cursor: "not-allowed",
  },
  saveButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#606C38",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
};
