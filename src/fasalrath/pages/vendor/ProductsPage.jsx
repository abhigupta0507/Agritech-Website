import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorProductsPage() {
  const { t } = useTranslation();
  const { authFetch } = useVendorAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/product`);
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      } else {
        console.log("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <span>{t("Products")}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="fr-page-title">🏪 {t("My Products")}</div>
          <button
            onClick={() => navigate("/fasalrath/vendor/add-product")}
            className="fr-btn fr-btn-primary"
            style={{ background: "#2A9D8F" }}
          >
            ➕ {t("Add New Product")}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div className="fr-spinner" />
        </div>
      ) : products.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {products.map((item) => (
            <div
              key={item._id}
              className="fr-card"
              onClick={() => navigate(`/fasalrath/vendor/edit-product/${item._id}`)}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: 20 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #e8eef5, #d4e4f7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    flexShrink: 0,
                  }}
                >
                  🌾
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--fr-slate)", marginBottom: 6 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--fr-text-light)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {t(item.category || "Unknown")} • {item.unit}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#2A9D8F" }}>
                      ₹{item.price}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: item.stock < 10 ? "#E76F51" : "#2A9D8F",
                      }}
                    >
                      {t("Stock")}: {item.stock}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 20, color: "#CCC" }}>›</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="fr-card">
          <div className="fr-card-body" style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏪</div>
            <div style={{ fontSize: 18, color: "var(--fr-text-light)", marginBottom: 24 }}>
              {t("No products found. Add one!")}
            </div>
            <button
              onClick={() => navigate("/fasalrath/vendor/add-product")}
              className="fr-btn fr-btn-primary"
              style={{ background: "#2A9D8F" }}
            >
              ➕ {t("Add New Product")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
