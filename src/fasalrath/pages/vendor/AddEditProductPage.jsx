import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorAddEditProductPage() {
  const { t } = useTranslation();
  const { authFetch } = useVendorAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/product/${id}`);
      const data = await res.json();

      if (res.ok && data.product) {
        setForm({
          name: data.product.name || "",
          category: data.product.category || "",
          price: data.product.price || "",
          stock: data.product.stock || "",
          unit: data.product.unit || "",
          description: data.product.description || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t("Product name is required");
    if (!form.category.trim()) errs.category = t("Category is required");
    if (!form.price || parseFloat(form.price) <= 0) errs.price = t("Valid price is required");
    if (!form.stock || parseInt(form.stock) < 0) errs.stock = t("Valid stock is required");
    if (!form.unit.trim()) errs.unit = t("Unit is required");
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
    try {
      const url = id
        ? `${API_BASE_URL}/api/vendor/product/${id}`
        : `${API_BASE_URL}/api/vendor/product`;
      
      const method = id ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          unit: form.unit,
          description: form.description,
        }),
      });

      if (res.ok) {
        alert(id ? t("Product updated!") : t("Product added!"));
        navigate("/fasalrath/vendor/products");
      } else {
        const data = await res.json();
        alert(data.message || t("Failed to save product"));
      }
    } catch (error) {
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t("Are you sure you want to delete this product?"))) {
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/product/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert(t("Product deleted!"));
        navigate("/fasalrath/vendor/products");
      } else {
        const data = await res.json();
        alert(data.message || t("Failed to delete product"));
      }
    } catch (error) {
      alert(t("Network error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <span onClick={() => navigate("/fasalrath/vendor/products")} style={{ cursor: "pointer" }}>
            {t("Products")}
          </span>
          <span> / </span>
          <span>{id ? t("Edit Product") : t("Add Product")}</span>
        </div>
        <div className="fr-page-title">
          {id ? "✏️" : "➕"} {id ? t("Edit Product") : t("Add New Product")}
        </div>
      </div>

      <div className="fr-card" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="fr-card-body">
          <form onSubmit={handleSubmit}>
            <div className="fr-form-group">
              <label className="fr-label">{t("Product Name")} *</label>
              <input
                className={`fr-input ${errors.name ? "error" : ""}`}
                value={form.name}
                onChange={set("name")}
                placeholder={t("e.g., Organic Wheat")}
              />
              {errors.name && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.name}
                </div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Category")} *</label>
              <select
                className={`fr-input ${errors.category ? "error" : ""}`}
                value={form.category}
                onChange={set("category")}
              >
                <option value="">{t("Select category")}</option>
                <option value="grains">{t("Grains")}</option>
                <option value="vegetables">{t("Vegetables")}</option>
                <option value="fruits">{t("Fruits")}</option>
                <option value="dairy">{t("Dairy")}</option>
                <option value="pulses">{t("Pulses")}</option>
                <option value="other">{t("Other")}</option>
              </select>
              {errors.category && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.category}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="fr-form-group">
                <label className="fr-label">{t("Price")} (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  className={`fr-input ${errors.price ? "error" : ""}`}
                  value={form.price}
                  onChange={set("price")}
                  placeholder="100"
                />
                {errors.price && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.price}
                  </div>
                )}
              </div>

              <div className="fr-form-group">
                <label className="fr-label">{t("Stock")} *</label>
                <input
                  type="number"
                  className={`fr-input ${errors.stock ? "error" : ""}`}
                  value={form.stock}
                  onChange={set("stock")}
                  placeholder="50"
                />
                {errors.stock && (
                  <div className="fr-input-error">
                    <span>⚠</span> {errors.stock}
                  </div>
                )}
              </div>
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Unit")} *</label>
              <select
                className={`fr-input ${errors.unit ? "error" : ""}`}
                value={form.unit}
                onChange={set("unit")}
              >
                <option value="">{t("Select unit")}</option>
                <option value="kg">{t("Kilogram (kg)")}</option>
                <option value="quintal">{t("Quintal")}</option>
                <option value="ton">{t("Ton")}</option>
                <option value="liter">{t("Liter")}</option>
                <option value="piece">{t("Piece")}</option>
                <option value="dozen">{t("Dozen")}</option>
              </select>
              {errors.unit && (
                <div className="fr-input-error">
                  <span>⚠</span> {errors.unit}
                </div>
              )}
            </div>

            <div className="fr-form-group">
              <label className="fr-label">{t("Description")}</label>
              <textarea
                className="fr-input"
                value={form.description}
                onChange={set("description")}
                placeholder={t("Optional product description")}
                rows={4}
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button
                type="button"
                onClick={() => navigate("/fasalrath/vendor/products")}
                className="fr-btn fr-btn-ghost"
                disabled={loading}
              >
                {t("Cancel")}
              </button>
              
              {id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="fr-btn"
                  style={{ background: "#E76F51", color: "white" }}
                  disabled={loading}
                >
                  🗑️ {t("Delete")}
                </button>
              )}

              <button
                type="submit"
                className="fr-btn"
                style={{ background: "#2A9D8F", color: "white" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="fr-spinner" style={{ width: 14, height: 14 }} />
                    {id ? t("Updating...") : t("Adding...")}
                  </>
                ) : (
                  <>
                    {id ? "💾" : "➕"} {id ? t("Update Product") : t("Add Product")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
