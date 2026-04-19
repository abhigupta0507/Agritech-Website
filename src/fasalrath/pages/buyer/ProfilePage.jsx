// src/fasalrath/pages/buyer/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

export default function BuyerProfilePage() {
  const { t } = useTranslation();
  const { buyer, authFetch, updateBuyerLocal, logout } = useBuyerAuth();

  // --- UI States ---
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // --- Data States ---
  const [dashboardData, setDashboardData] = useState({
    stats: { requirementsCount: 0, activeBids: 0, wonBids: 0 },
    recentRequirements: [],
  });

  // --- Form States ---
  const [form, setForm] = useState({
    companyName: buyer?.companyName || "",
    contactPerson: buyer?.contactPerson || "",
    email: buyer?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  // =========================
  // INITIAL DATA FETCH
  // =========================
  useEffect(() => {
    fetchFullProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFullProfile = async () => {
    try {
      // NOTE: Ensure this matches your actual GET route in the backend router
      const res = await authFetch(`${API_BASE_URL}/api/buyer/auth/profile`);
      const data = await res.json();

      if (res.ok) {
        setDashboardData({
          stats: data.stats || {
            requirementsCount: 0,
            activeBids: 0,
            wonBids: 0,
          },
          recentRequirements: data.recentRequirements || [],
        });

        // Sync the latest buyer info from DB to our local context just in case
        if (data.buyer) {
          updateBuyerLocal(data.buyer);
        }
      }
    } catch (error) {
      console.error("Failed to load profile dashboard:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Sync form when buyer context changes
  useEffect(() => {
    setForm({
      companyName: buyer?.companyName || "",
      contactPerson: buyer?.contactPerson || "",
      email: buyer?.email || "",
    });
  }, [buyer]);

  // =========================
  // UPDATE PROFILE HANDLERS
  // =========================
  const openEditModal = () => {
    setForm({
      companyName: buyer?.companyName || "",
      contactPerson: buyer?.contactPerson || "",
      email: buyer?.email || "",
    });
    setErrors({});
    setApiError("");
    setModalVisible(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim())
      newErrors.companyName = t("Organization name is required");
    if (!form.contactPerson.trim())
      newErrors.contactPerson = t("Contact person name is required");

    const emailRegex = /\S+@\S+\.\S+/;
    if (!form.email.trim()) {
      newErrors.email = t("Email is required");
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = t("Please enter a valid email");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setSaving(true);
    setApiError("");

    const payload = {
      companyName: form.companyName.trim(),
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
    };

    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/buyer/auth/update-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.message || t("Failed to update profile"));

      updateBuyerLocal({ ...buyer, ...payload, ...(data.buyer || {}) });
      setModalVisible(false);
    } catch (error) {
      setApiError(error.message || t("Something went wrong"));
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UI RENDER
  // =========================
  if (loadingProfile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F8F9FA",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#2A9D8F",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          <div className="fr-spinner" style={{ margin: "0 auto 16px" }} />
          {t("Loading Profile...")}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        paddingBottom: 40,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "40px 20px 16px",
          backgroundColor: "#FFF",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#264653",
            margin: 0,
            maxWidth: 800,
            marginInline: "auto",
          }}
        >
          {t("Dashboard & Profile")}
        </h1>
      </div>

      <div style={{ maxWidth: 800, margin: "20px auto 0", padding: "0 20px" }}>
        {/* STATS GRID */}
        {/*  */}

        {/* MAIN PROFILE CARD */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#FFF8F0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 32,
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              🏢
            </div>
            <div style={{ marginLeft: 20, flex: 1 }}>
              <div
                style={{ fontSize: 24, fontWeight: "bold", color: "#264653" }}
              >
                {buyer?.companyName || t("Buyer Company")}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#666",
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                📧 {buyer?.email || t("N/A")}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#F8F9FA",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: 14, color: "#666" }}>
                {t("Contact Person")}
              </span>
              <span
                style={{ fontSize: 15, fontWeight: "bold", color: "#264653" }}
              >
                {buyer?.contactPerson || "N/A"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: "#666" }}>
                {t("Phone Number")}
              </span>
              <span
                style={{ fontSize: 15, fontWeight: "bold", color: "#2A9D8F" }}
              >
                ✅ +91 {buyer?.phone?.replace("+91", "") || "N/A"}
              </span>
            </div>
          </div>

          <button
            onClick={openEditModal}
            style={{
              width: "100%",
              padding: 14,
              background: "#FFF",
              border: "2px solid #E76F51",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: "bold",
              color: "#E76F51",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            ✏️ {t("Edit Company Details")}
          </button>
        </div>

        {/* RECENT REQUIREMENTS SECTION
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#264653",
                margin: 0,
              }}
            >
              {t("Recent Requirements")}
            </h2>
          </div>

          {dashboardData.recentRequirements.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px 0",
                backgroundColor: "#F8F9FA",
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 40, opacity: 0.5 }}>🌱</span>
              <p style={{ color: "#666", marginTop: 12, fontWeight: "500" }}>
                {t("You haven't posted any requirements yet.")}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {dashboardData.recentRequirements.map((req) => (
                <div
                  key={req._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    border: "1px solid #E0E0E0",
                    borderRadius: 12,
                    backgroundColor: "#FAFAFA",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#264653",
                        marginBottom: 4,
                      }}
                    >
                      {req.cropName || t("Crop Name")}
                    </div>
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#2A9D8F",
                      }}
                    >
                      {req.quantity} {req.unit}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#E76F51",
                        fontWeight: "600",
                        marginTop: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {req.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* SIGN OUT */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 12,
              border: "none",
              backgroundColor: "#264653",
              color: "#FFF",
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(38, 70, 83, 0.2)",
            }}
          >
            🚪 {t("Sign Out")}
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {modalVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFF",
              width: "100%",
              maxWidth: 500,
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#264653",
                  margin: 0,
                }}
              >
                {t("Edit Details")}
              </h2>
              <button
                onClick={() => !saving && setModalVisible(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                ✖️
              </button>
            </div>

            {apiError && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: "#FDECEA",
                  color: "#E76F51",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                {apiError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#666",
                    marginBottom: 6,
                  }}
                >
                  {t("Organization Name")}
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) => {
                    setForm({ ...form, companyName: e.target.value });
                    setErrors({ ...errors, companyName: null });
                  }}
                  disabled={saving}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 14,
                    borderRadius: 10,
                    border: `1.5px solid ${errors.companyName ? "#E76F51" : "#E0E0E0"}`,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
                {errors.companyName && (
                  <div style={{ fontSize: 12, color: "#E76F51", marginTop: 4 }}>
                    {errors.companyName}
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#666",
                    marginBottom: 6,
                  }}
                >
                  {t("Contact Person")}
                </label>
                <input
                  value={form.contactPerson}
                  onChange={(e) => {
                    setForm({ ...form, contactPerson: e.target.value });
                    setErrors({ ...errors, contactPerson: null });
                  }}
                  disabled={saving}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 14,
                    borderRadius: 10,
                    border: `1.5px solid ${errors.contactPerson ? "#E76F51" : "#E0E0E0"}`,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
                {errors.contactPerson && (
                  <div style={{ fontSize: 12, color: "#E76F51", marginTop: 4 }}>
                    {errors.contactPerson}
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#666",
                    marginBottom: 6,
                  }}
                >
                  {t("Email Address")}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({ ...errors, email: null });
                  }}
                  disabled={saving}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 14,
                    borderRadius: 10,
                    border: `1.5px solid ${errors.email ? "#E76F51" : "#E0E0E0"}`,
                    fontSize: 15,
                    outline: "none",
                  }}
                />
                {errors.email && (
                  <div style={{ fontSize: 12, color: "#E76F51", marginTop: 4 }}>
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setModalVisible(false)}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 10,
                  border: "1.5px solid #E0E0E0",
                  backgroundColor: "transparent",
                  fontWeight: "bold",
                  color: "#666",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                style={{
                  flex: 2,
                  padding: 14,
                  borderRadius: 10,
                  border: "none",
                  backgroundColor: "#E76F51",
                  fontWeight: "bold",
                  color: "#FFF",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? t("Saving...") : t("Save Changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
