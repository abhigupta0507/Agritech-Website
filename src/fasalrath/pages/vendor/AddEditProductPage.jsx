// src/fasalrath/pages/vendor/AddEditProductPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

const CATEGORIES = [
  { label: "Seeds", value: "seeds" },
  { label: "Tools", value: "tools" },
  { label: "Machines", value: "machines" },
  { label: "Agri Inputs", value: "agri-inputs" },
  { label: "Rentals", value: "rentals" },
];

export default function VendorAddEditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { vendor, authFetch } = useVendorAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/product/${id}`);
      const data = await res.json();

      if (res.ok) {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price.toString());
        setStock(data.stock.toString());
        setUnit(data.unit || "");
        setCategory(data.category);
      } else {
        alert(t("Could not fetch product details"));
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert(t("Network error fetching details"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !price || !category || !unit) {
      alert(t("Please fill in Name, Price, Unit, and Category."));
      return;
    }

    setIsLoading(true);
    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      unit,
      category,
    };

    try {
      const url = id
        ? `${API_BASE_URL}/api/vendor/product/${id}`
        : `${API_BASE_URL}/api/vendor/product`;

      const method = id ? "PUT" : "POST";

      const res = await authFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (res.ok) {
        const successMsg = id
          ? t("Product updated successfully!")
          : t("Product created successfully!");

        alert(successMsg);
        navigate(-1);
      } else {
        alert(data.message || t("Operation failed"));
      }
    } catch (err) {
      console.error(err);
      alert(t("Network request failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        t(
          "Are you sure you want to delete this product? This cannot be undone.",
        ),
      )
    ) {
      return;
    }

    authFetch(`${API_BASE_URL}/api/vendor/product/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert(t("Product has been deleted."));
          navigate(-1);
        } else {
          alert(t("Failed to delete product"));
        }
      })
      .catch(() => {
        alert(t("Network error"));
      });
  };

  if (isLoading && id && !name) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <div className="fr-spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "40px 0 16px",
          backgroundColor: "#FFF",
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
          {id ? t("Edit Product") : t("Add New Product")}
        </h1>
      </div>

      <div style={{ padding: "20px 0 40px" }}>
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
            {t("Product Name")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {t("Description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              {t("Price (₹)")}
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              {t("Stock")}
            </label>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
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
        </div>

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
            {t("Unit (e.g., kg, ton, piece)")}
          </label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder={t("kg")}
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
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 20,
                  backgroundColor:
                    category === cat.value ? "#457B9D" : "#F0F0F0",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: category === cat.value ? "#FFFFFF" : "#333",
                  cursor: "pointer",
                }}
              >
                {t(cat.label)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          style={{
            width: "100%",
            marginTop: 24,
            padding: 16,
            backgroundColor: isLoading ? "#CCC" : "#457B9D",
            border: "none",
            borderRadius: 12,
            color: "#FFF",
            fontSize: 16,
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? t("Saving...") : t("Save Product")}
        </button>

        {id && (
          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              marginTop: 16,
              padding: 16,
              backgroundColor: "transparent",
              border: "1px solid #E76F51",
              borderRadius: 12,
              color: "#E76F51",
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {t("Delete Product")}
          </button>
        )}
      </div>
    </div>
  );
}
