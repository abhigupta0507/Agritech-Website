import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useVendorAuth } from "../../context/VendorAuthContext";
import { API_BASE_URL } from "../../config";

export default function VendorTransactionsPage() {
  const { t } = useTranslation();
  const { authFetch } = useVendorAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/api/vendor/transactions`);
      const data = await res.json();

      if (res.ok) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTypeColor = (type) => {
    if (type === "credit") return "#2A9D8F";
    if (type === "debit") return "#E76F51";
    return "#666";
  };

  const getTypeIcon = (type) => {
    if (type === "credit") return "↓";
    if (type === "debit") return "↑";
    return "•";
  };

  const filteredTransactions = getFilteredTransactions();
  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <span>{t("Transactions")}</span>
        </div>
        <div className="fr-page-title">💳 {t("Track Transactions & Payments")}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div className="fr-card" style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📥</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#2A9D8F", marginBottom: 4 }}>
            ₹{totalCredit.toFixed(2)}
          </div>
          <div style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
            {t("Total Credit")}
          </div>
        </div>

        <div className="fr-card" style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📤</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#E76F51", marginBottom: 4 }}>
            ₹{totalDebit.toFixed(2)}
          </div>
          <div style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
            {t("Total Debit")}
          </div>
        </div>

        <div className="fr-card" style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fr-slate)", marginBottom: 4 }}>
            ₹{(totalCredit - totalDebit).toFixed(2)}
          </div>
          <div style={{ fontSize: 14, color: "var(--fr-text-light)" }}>
            {t("Net Balance")}
          </div>
        </div>
      </div>

      <div className="fr-card">
        <div className="fr-card-header">
          <span className="fr-card-title">{t("Transaction History")}</span>
          <div style={{ display: "flex", gap: 8 }}>
            {["all", "credit", "debit"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`fr-btn fr-btn-sm ${filter === f ? "" : "fr-btn-ghost"}`}
                style={filter === f ? { background: "#457B9D", color: "white" } : {}}
              >
                {t(f.charAt(0).toUpperCase() + f.slice(1))}
              </button>
            ))}
          </div>
        </div>

        <div className="fr-card-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div className="fr-spinner" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredTransactions.map((item) => (
                <div
                  key={item._id || item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    background: "var(--fr-off)",
                    borderRadius: 8,
                    border: "1px solid var(--fr-border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: getTypeColor(item.type) + "20",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        color: getTypeColor(item.type),
                      }}
                    >
                      {getTypeIcon(item.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fr-slate)", marginBottom: 2 }}>
                        {item.description || t("Transaction")}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--fr-text-light)" }}>
                        {formatDate(item.createdAt || item.date)}
                      </div>
                      {item.orderId && (
                        <div style={{ fontSize: 12, color: "var(--fr-text-light)", marginTop: 2 }}>
                          {t("Order")}: #{item.orderId.slice(-6).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: getTypeColor(item.type),
                    }}
                  >
                    {item.type === "credit" ? "+" : "-"}₹{item.amount?.toFixed(2) || "0.00"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 60, color: "var(--fr-text-light)" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💳</div>
              <div style={{ fontSize: 18 }}>
                {t("No transactions found")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
