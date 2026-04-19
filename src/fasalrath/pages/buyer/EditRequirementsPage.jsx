// src/fasalrath/pages/buyer/EditRequirementPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

const CATEGORIES = ["crops", "grains", "vegetables", "fruits", "flowers", "spices"];
const GRADES = ["Any", "A", "B", "C", "Export", "Organic"];

export default function EditRequirementPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // --- Form State ---
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [category, setCategory] = useState("crops");

  // Contract
  const [contractType, setContractType] = useState("pre_harvest_contract");
  const [requiredByDate, setRequiredByDate] = useState("");

  // Qty/Price
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);

  // Quality/Logistics
  const [qualityGrade, setQualityGrade] = useState("Any");
  const [logisticsType, setLogisticsType] = useState("buyer_pick_up");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");

  // 1. Fetch Details on Mount
  useEffect(() => {
    if (id) fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, buyer]);

  const fetchDetails = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/buyer/requirements/${id}`);
      const data = await res.json();

      if (res.ok && data.requirement) {
        const r = data.requirement;
        setCropName(r.cropName || "");
        setVariety(r.variety || "");
        setCategory(r.category || "crops");
        setContractType(r.contractType || "pre_harvest_contract");

        // Format Date to YYYY-MM-DD for HTML input type="date"
        if (r.requiredByDate) {
          setRequiredByDate(new Date(r.requiredByDate).toISOString().split("T")[0]);
        }

        setQuantity(r.quantity?.toString() || "");
        setUnit(r.unit || "");
        setTargetPrice(r.targetPrice?.toString() || "");
        setIsNegotiable(r.isNegotiable ?? true);
        setQualityGrade(r.qualityGrade || "Any");
        setLogisticsType(r.logisticsType || "buyer_pick_up");
        setDeliveryAddress(r.deliveryLocation?.address || "");
        setDescription(r.description || "");
      } else {
        alert(data.message || t("Failed to fetch details"));
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setInitialLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!cropName || !quantity || !unit || !targetPrice) {
      return alert(`${t("Missing Fields")}: ${t("Please fill all required fields")}`);
    }

    setLoading(true);

    try {
      const payload = {
        cropName,
        variety,
        category,
        contractType,
        requiredByDate: requiredByDate ? new Date(requiredByDate) : null,
        quantity: parseFloat(quantity),
        unit,
        targetPrice: parseFloat(targetPrice),
        isNegotiable,
        qualityGrade,
        logisticsType,
        deliveryLocation: { address: deliveryAddress },
        description,
      };

      const res = await authFetch(`${API_BASE_URL}/api/buyer/requirements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("Requirement updated successfully!"));
        navigate(-1);
      } else {
        alert(data.message || t("Failed to update"));
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(t("Are you sure you want to remove this requirement?"));
    if (!isConfirmed) return;

    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE_URL}/api/buyer/requirements/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert(t("Requirement removed."));
        navigate(-1);
      } else {
        const data = await res.json();
        alert(data.message || t("Failed to delete"));
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#F8F9FA" }}>
        <div style={{ textAlign: "center", color: "#2A9D8F", fontSize: 18, fontWeight: "bold" }}>
          <div className="fr-spinner" style={{ margin: "0 auto 16px" }} />
          {t("Loading...")}
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh", paddingBottom: 40, fontFamily: "sans-serif" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", padding: "40px 20px 16px", backgroundColor: "#FFF", borderBottom: "1px solid #E0E0E0" }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#264653" }}>
          ←
        </button>
        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#264653", margin: 0 }}>
          {t("Edit Requirement")}
        </h1>
      </div>

      <div style={{ maxWidth: 800, margin: "20px auto 0", padding: "0 20px" }}>
        <div style={{ backgroundColor: "#FFF", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          
          {/* CONTRACT TYPE TOGGLE */}
          <div style={{ display: "flex", backgroundColor: "#F0F0F0", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            <button
              onClick={() => setContractType("spot_market")}
              style={{
                flex: 1, padding: "12px 0", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: "bold", fontSize: 15, transition: "0.2s",
                backgroundColor: contractType === "spot_market" ? "#F4A261" : "transparent",
                color: contractType === "spot_market" ? "#FFF" : "#666",
                boxShadow: contractType === "spot_market" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
              }}
            >
              {t("Spot Market")}
            </button>
            <button
              onClick={() => setContractType("pre_harvest_contract")}
              style={{
                flex: 1, padding: "12px 0", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: "bold", fontSize: 15, transition: "0.2s",
                backgroundColor: contractType === "pre_harvest_contract" ? "#9C27B0" : "transparent",
                color: contractType === "pre_harvest_contract" ? "#FFF" : "#666",
                boxShadow: contractType === "pre_harvest_contract" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
              }}
            >
              {t("Pre-Harvest")}
            </button>
          </div>

          {/* CROP & VARIETY */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div className="fr-input-group">
              <label>{t("Crop Name")} *</label>
              <input value={cropName} onChange={(e) => setCropName(e.target.value)} placeholder="e.g. Wheat" />
            </div>
            <div className="fr-input-group">
              <label>{t("Variety")}</label>
              <input value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g. Sharbati" />
            </div>
          </div>

          {/* CATEGORY PILLS */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: "bold", color: "#666", marginBottom: 8 }}>{t("Category")}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: "bold", transition: "0.2s",
                    backgroundColor: category === cat ? "#E76F51" : "#F0F0F0",
                    color: category === cat ? "#FFF" : "#666"
                  }}
                >
                  {t(cat.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* QTY & UNIT */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
            <div className="fr-input-group">
              <label>{t("Quantity")} *</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
            </div>
            <div className="fr-input-group">
              <label>{t("Unit")} *</label>
              <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. Tonnes" />
            </div>
          </div>

          {/* TARGET PRICE & NEGOTIABLE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", marginBottom: 20 }}>
            <div className="fr-input-group" style={{ marginBottom: 0 }}>
              <label>{t("Target Price (per unit)")} *</label>
              <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="₹" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20 }}>
              <label style={{ fontSize: 12, color: "#666", marginBottom: 4, fontWeight: "bold" }}>{t("Negotiable")}</label>
              <label className="fr-switch">
                <input type="checkbox" checked={isNegotiable} onChange={(e) => setIsNegotiable(e.target.checked)} />
                <span className="fr-slider"></span>
              </label>
            </div>
          </div>

          {/* DATE */}
          <div className="fr-input-group" style={{ marginBottom: 20 }}>
            <label>{t("Required By Date")}</label>
            <input type="date" value={requiredByDate} onChange={(e) => setRequiredByDate(e.target.value)} />
          </div>

          {/* QUALITY GRADES */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: "bold", color: "#666", marginBottom: 8 }}>{t("Quality Grade")}</label>
            <div style={{ display: "flex", overflowX: "auto", paddingBottom: 8, gap: 8 }}>
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setQualityGrade(g)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: "bold", whiteSpace: "nowrap", transition: "0.2s",
                    backgroundColor: qualityGrade === g ? "#2A9D8F" : "#F0F0F0",
                    color: qualityGrade === g ? "#FFF" : "#666"
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* LOGISTICS */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: "bold", color: "#666", marginBottom: 8 }}>{t("Logistics")}</label>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setLogisticsType("buyer_pick_up")}
                style={{
                  flex: 1, padding: 12, borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 14, transition: "0.2s",
                  border: `2px solid ${logisticsType === "buyer_pick_up" ? "#457B9D" : "#E0E0E0"}`,
                  backgroundColor: logisticsType === "buyer_pick_up" ? "#457B9D" : "#FFF",
                  color: logisticsType === "buyer_pick_up" ? "#FFF" : "#666"
                }}
              >
                🚚 {t("I will Pick Up")}
              </button>
              <button
                onClick={() => setLogisticsType("farmer_delivery")}
                style={{
                  flex: 1, padding: 12, borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 14, transition: "0.2s",
                  border: `2px solid ${logisticsType === "farmer_delivery" ? "#457B9D" : "#E0E0E0"}`,
                  backgroundColor: logisticsType === "farmer_delivery" ? "#457B9D" : "#FFF",
                  color: logisticsType === "farmer_delivery" ? "#FFF" : "#666"
                }}
              >
                🚜 {t("Farmer Delivers")}
              </button>
            </div>
          </div>

          {/* ADDRESS & DESCRIPTION */}
          <div className="fr-input-group" style={{ marginBottom: 20 }}>
            <label>{t("Delivery Address")}</label>
            <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2} />
          </div>

          <div className="fr-input-group" style={{ marginBottom: 24 }}>
            <label>{t("Description / Notes")}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button
              onClick={handleUpdate}
              disabled={loading}
              style={{
                padding: 16, borderRadius: 12, border: "none", backgroundColor: "#2A9D8F", color: "#FFF",
                fontSize: 16, fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? t("Saving...") : t("Save Changes")}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: 16, borderRadius: 12, border: "2px solid #E76F51", backgroundColor: "transparent", color: "#E76F51",
                fontSize: 16, fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1
              }}
            >
              🗑️ {t("Delete Requirement")}
            </button>
          </div>
        </div>
      </div>

      {/* Internal Styles for Web Form Controls */}
      <style>{`
        .fr-input-group {
          display: flex;
          flex-direction: column;
        }
        .fr-input-group label {
          font-size: 13px;
          font-weight: bold;
          color: #666;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .fr-input-group input, 
        .fr-input-group textarea {
          padding: 14px;
          border-radius: 10px;
          border: 1.5px solid #E0E0E0;
          background-color: #FAFAFA;
          font-size: 15px;
          color: #264653;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .fr-input-group input:focus, 
        .fr-input-group textarea:focus {
          border-color: #2A9D8F;
          background-color: #FFF;
        }
        
        /* Custom Toggle Switch CSS */
        .fr-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }
        .fr-switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .fr-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        .fr-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        .fr-switch input:checked + .fr-slider {
          background-color: #2A9D8F;
        }
        .fr-switch input:checked + .fr-slider:before {
          transform: translateX(22px);
        }
      `}</style>
    </div>
  );
}