// src/fasalrath/pages/buyer/PostRequirementPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBuyerAuth } from "../../context/BuyerAuthContext";
import { API_BASE_URL } from "../../config";

const CATEGORIES = [
  "crops",
  "grains",
  "vegetables",
  "fruits",
  "flowers",
  "spices",
];
const GRADES = ["Any", "A", "B", "C", "Export", "Organic"];

export default function PostRequirementPage() {
  const navigate = useNavigate();
  const { buyer, authFetch } = useBuyerAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [category, setCategory] = useState("crops");
  const [contractType, setContractType] = useState("pre_harvest_contract");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("ton");
  const [targetPrice, setTargetPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [qualityGrade, setQualityGrade] = useState("Any");
  const [logisticsType, setLogisticsType] = useState("buyer_pick_up");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!cropName || !quantity || !targetPrice || !requiredByDate) {
      alert(t("Please fill Crop Name, Quantity, Price and Date."));
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(requiredByDate)) {
      alert(t("Please use YYYY-MM-DD format"));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        cropName,
        category,
        variety,
        quantity: parseFloat(quantity),
        unit,
        targetPrice: parseFloat(targetPrice),
        isNegotiable,
        contractType,
        requiredByDate: new Date(requiredByDate),
        qualityGrade,
        logisticsType,
        deliveryLocation: { address: deliveryAddress || t("Main Warehouse") },
        description,
      };

      const res = await authFetch(`${API_BASE_URL}/api/buyer/requirements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(t("Requirement posted successfully!"));
        navigate(-1);
      } else {
        alert(data.message || t("Failed to post"));
      }
    } catch (error) {
      console.error(error);
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "40px 0 16px",
          borderBottom: "1px solid #EEE",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginRight: 16,
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#264653",
            margin: 0,
          }}
        >
          {t("New Requirement")}
        </h1>
      </div>

      <div style={{ padding: "20px 0 40px" }}>
        {/* Contract Type */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#F0F0F0",
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setContractType("spot_market")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              borderRadius: 10,
              gap: 8,
              backgroundColor:
                contractType === "spot_market" ? "#F4A261" : "transparent",
              border: "none",
              fontWeight: 600,
              color: contractType === "spot_market" ? "#FFF" : "#666",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20 }}>🏪</span>
            {t("Spot Market")}
          </button>

          <button
            onClick={() => setContractType("pre_harvest_contract")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              borderRadius: 10,
              gap: 8,
              backgroundColor:
                contractType === "pre_harvest_contract"
                  ? "#9C27B0"
                  : "transparent",
              border: "none",
              fontWeight: 600,
              color: contractType === "pre_harvest_contract" ? "#FFF" : "#666",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20 }}>🌱</span>
            {t("Pre-Harvest")}
          </button>
        </div>

        {/* Crop Name */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Crop Name")}
          </label>
          <input
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder={t("e.g. Potato, Wheat")}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #DDD",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Variety */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Variety (Optional)")}
          </label>
          <input
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            placeholder={t("e.g. Jyoti, Sharbati")}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #DDD",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Category")}
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  backgroundColor: category === cat ? "#E76F51" : "#F0F0F0",
                  border: "1px solid",
                  borderColor: category === cat ? "#E76F51" : "transparent",
                  fontSize: 13,
                  fontWeight: 600,
                  color: category === cat ? "#FFF" : "#666",
                  cursor: "pointer",
                }}
              >
                {t(cat.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Unit */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: 15,
                color: "#666",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              {t("Quantity")}
            </label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="100"
              type="number"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #DDD",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: 15,
                color: "#666",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              {t("Unit")}
            </label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder={t("e.g. Tons")}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #DDD",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Target Price & Negotiable */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: 15,
                color: "#666",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              {t("Target Price")}
            </label>
            <input
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={t("₹ per unit")}
              type="number"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #DDD",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginTop: 5, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
              {t("Negotiable")}
            </div>
            <input
              type="checkbox"
              checked={isNegotiable}
              onChange={(e) => setIsNegotiable(e.target.checked)}
              style={{ width: 20, height: 20, cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Required By Date */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Required By Date (Deadline)")}
          </label>
          <input
            value={requiredByDate}
            onChange={(e) => setRequiredByDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #DDD",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
          {contractType === "pre_harvest_contract" && (
            <div
              style={{
                fontSize: 12,
                color: "#9C27B0",
                marginTop: 4,
                fontStyle: "italic",
              }}
            >
              {t("Farmers need to know when you expect the harvest.")}
            </div>
          )}
        </div>

        {/* Quality Grade */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Quality Grade")}
          </label>
          <div style={{ display: "flex", overflowX: "auto", gap: 8 }}>
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setQualityGrade(g)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  backgroundColor: qualityGrade === g ? "#2A9D8F" : "#F0F0F0",
                  border: "1px solid",
                  borderColor: qualityGrade === g ? "#2A9D8F" : "transparent",
                  fontSize: 13,
                  fontWeight: 600,
                  color: qualityGrade === g ? "#FFF" : "#666",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Logistics */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Logistics / Delivery")}
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setLogisticsType("buyer_pick_up")}
              style={{
                flex: 1,
                padding: 12,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#DDD",
                borderRadius: 8,
                backgroundColor:
                  logisticsType === "buyer_pick_up" ? "#457B9D" : "#FFF",
                color: logisticsType === "buyer_pick_up" ? "#FFF" : "#666",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("I will Pick Up")}
            </button>
            <button
              onClick={() => setLogisticsType("farmer_delivery")}
              style={{
                flex: 1,
                padding: 12,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#DDD",
                borderRadius: 8,
                backgroundColor:
                  logisticsType === "farmer_delivery" ? "#457B9D" : "#FFF",
                color: logisticsType === "farmer_delivery" ? "#FFF" : "#666",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {t("Farmer Delivers")}
            </button>
          </div>
        </div>

        {/* Delivery Address */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Delivery/Pickup Address")}
          </label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder={t("City, State or Warehouse Address")}
            rows={2}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #DDD",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              color: "#666",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {t("Additional Requirements")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("Moisture content, packaging requirements, etc.")}
            rows={3}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #DDD",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 16,
            backgroundColor: loading ? "#CCC" : "#E76F51",
            border: "none",
            borderRadius: 12,
            color: "#FFF",
            fontSize: 16,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? t("Posting...") : t("Post Requirement")}
        </button>
      </div>
    </div>
  );
}
