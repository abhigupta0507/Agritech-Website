import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFarmerAuth } from "../../context/FarmerAuthContext";
import { API_BASE_URL } from "../../config";
import moment from "moment";
import "../../styles/farmer-transaction-history.css";

const TABS = ["All", "Income", "Expense"];

export default function FarmerTransactionHistoryPage() {
  const { t } = useTranslation();
  const { authFetch } = useFarmerAuth();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const res = await authFetch(`${API_BASE_URL}/api/data/transactions`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTransactions(data.data || []);
        setSummary(
          data.summary || { totalIncome: 0, totalExpense: 0, balance: 0 }
        );
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = activeTab === "All"
    ? transactions
    : transactions.filter((t) => t.type?.toLowerCase() === activeTab.toLowerCase());

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fth-container fr-fade-in">
      <div className="fr-page-header">
        <div className="fr-page-breadcrumb">
          <Link to="/fasalrath/dashboard">{t("Dashboard")}</Link>
          <span>/</span>
          <span>{t("My Transactions")}</span>
        </div>
        <div className="fr-page-title">💰 {t("My Transactions")}</div>
      </div>

      <div className="fth-summary-card">
        <div className="fth-balance-section">
          <div className="fth-balance-label">{t("Net Balance")}</div>
          <div className="fth-balance-amount">{formatCurrency(summary.balance)}</div>
        </div>

        <div className="fth-divider" />

        <div className="fth-stats-row">
          <div className="fth-stat-item">
            <div className="fth-stat-icon income">↓</div>
            <div>
              <div className="fth-stat-label">{t("Income")}</div>
              <div className="fth-stat-value income">{formatCurrency(summary.totalIncome)}</div>
            </div>
          </div>

          <div className="fth-stat-item">
            <div className="fth-stat-icon expense">↑</div>
            <div>
              <div className="fth-stat-label">{t("Expense")}</div>
              <div className="fth-stat-value expense">{formatCurrency(summary.totalExpense)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="fth-tab-container">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`fth-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="fth-loading">
          <div className="fr-spinner fr-spinner-teal" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="fth-empty">
          <div className="fth-empty-icon">📋</div>
          <div className="fth-empty-text">
            {t("No {{type}} transactions found.", {
              type: t(activeTab).toLowerCase(),
            })}
          </div>
        </div>
      ) : (
        <div className="fth-list">
          {filteredTransactions.map((item) => {
            const isIncome = item.type === "income";
            const color = isIncome ? "#2A9D8F" : "#E76F51";
            const sign = isIncome ? "+" : "-";

            return (
              <div key={item._id} className="fth-card">
                <div className="fth-icon-container" style={{ backgroundColor: color + "20" }}>
                  <span style={{ fontSize: 24 }}>{item.icon || (isIncome ? "💵" : "🛒")}</span>
                </div>

                <div className="fth-card-info">
                  <div className="fth-card-title">{item.title}</div>
                  <div className="fth-card-subtitle">{item.subtitle}</div>
                </div>

                <div className="fth-card-amount-container">
                  <div className="fth-card-amount" style={{ color }}>
                    {sign}₹{item.amount?.toLocaleString("en-IN")}
                  </div>
                  <div className="fth-card-date">
                    {moment(item.date).format("DD MMM, YY")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}