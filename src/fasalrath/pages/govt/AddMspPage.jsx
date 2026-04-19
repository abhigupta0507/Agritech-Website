// src/fasalrath/pages/govt/AddMspPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGovtAuth } from "../../context/GovtAuthContext";
import { API_BASE_URL } from "../../config";

export default function AddMspPage() {
  const navigate = useNavigate();
  const { authFetch } = useGovtAuth();
  const { t } = useTranslation();

  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [season, setSeason] = useState("year-round");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!cropName.trim()) {
      alert(t("Please enter crop name"));
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      alert(t("Please enter a valid price"));
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/msp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: cropName.trim(),
          price: parseFloat(price),
          unit,
          season,
          effectiveFrom: new Date(),
        }),
      });

      if (response.ok) {
        alert(t("MSP added successfully"));
        navigate("/fasalrath/govt/msp-compliance");
      } else {
        const error = await response.json();
        alert(error.message || t("Failed to add MSP"));
      }
    } catch (error) {
      console.error("Add MSP Error:", error);
      alert(t("Failed to add MSP"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 style={styles.headerTitle}>{t("Add New MSP")}</h1>
        <div style={{ width: "24px" }} />
      </div>

      <div style={styles.container}>
        <div style={styles.iconHeader}>
          <span style={styles.icon}>➕</span>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Crop Name")}</label>
            <input
              style={styles.input}
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder={t("e.g., Wheat, Paddy, etc.")}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("MSP Price (₹)")}</label>
            <input
              type="number"
              style={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t("Enter price")}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.label}>{t("Unit")}</div>
            <div style={styles.radioGroup}>
              {["quintal", "kg", "ton"].map((u) => (
                <button
                  key={u}
                  style={{
                    ...styles.radioButton,
                    ...(unit === u ? styles.radioButtonActive : {}),
                  }}
                  onClick={() => setUnit(u)}
                >
                  <span
                    style={{
                      ...styles.radioText,
                      ...(unit === u ? styles.radioTextActive : {}),
                    }}
                  >
                    {t(u)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.label}>{t("Season")}</div>
            <div style={styles.radioGroup}>
              {[
                { label: t("Kharif"), value: "kharif" },
                { label: t("Rabi"), value: "rabi" },
                { label: t("Year-Round"), value: "year-round" },
              ].map((s) => (
                <button
                  key={s.value}
                  style={{
                    ...styles.radioButton,
                    ...(season === s.value ? styles.radioButtonActive : {}),
                  }}
                  onClick={() => setSeason(s.value)}
                >
                  <span
                    style={{
                      ...styles.radioText,
                      ...(season === s.value ? styles.radioTextActive : {}),
                    }}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.6 : 1,
            }}
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? t("Adding...") : t("Add MSP")}
          </button>
        </div>
      </div>
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
  backButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#264653",
    cursor: "pointer",
  },
  headerTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#264653",
    margin: 0,
  },
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  iconHeader: {
    textAlign: "center",
    margin: "24px 0",
  },
  icon: {
    fontSize: "60px",
  },
  form: {
    backgroundColor: "#FFF",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#264653",
    marginBottom: "12px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  radioGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  radioButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "2px solid #E0E0E0",
    backgroundColor: "#FFF",
    cursor: "pointer",
  },
  radioButtonActive: {
    borderColor: "#606C38",
    backgroundColor: "#F0F2E6",
  },
  radioText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  radioTextActive: {
    color: "#606C38",
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
    marginTop: "24px",
  },
};
