import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api, { getApiErrorMessage } from "../services/api";
import "../css/Dashboard.css";

const formatMoney = (amount, currency) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2
    }).format(Number(amount || 0));
  } catch {
    return `${currency || ""} ${Number(amount || 0).toLocaleString()}`.trim();
  }
};

const formatMonth = (month) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString(undefined, { month: "short" });
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const RANGE_OPTIONS = [
  { value: "1W", label: "1 Week" },
  { value: "1M", label: "1 Month" },
  { value: "6M", label: "6 Months" }
];

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState("");
  const [selectedRange, setSelectedRange] = useState("1W");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/dashboard", {
          params: { range: selectedRange }
        });
        if (active) {
          setDashboard(response.data);
          setSelectedAccountNumber((current) => {
            const stillExists = response.data.accounts.some(
              (account) => String(account.accountNumber) === current
            );
            return stillExists ? current : String(response.data.accounts[0]?.accountNumber || "");
          });
        }
      } catch (requestError) {
        if (active) setError(getApiErrorMessage(requestError, "Unable to load your dashboard."));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, [selectedRange]);

  const accounts = dashboard?.accounts || [];
  const account = accounts.find((item) => String(item.accountNumber) === selectedAccountNumber);
  const netFlow = Number(account?.totalCredit || 0) - Number(account?.totalDebit || 0);
  const rangeLabel = RANGE_OPTIONS.find((option) => option.value === selectedRange)?.label || "1 Week";

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <button className="dashboard-brand" onClick={() => navigate("/home")}>
          <span className="dashboard-brand-mark" aria-hidden="true">F</span>
            <span>Personal Finance Tracker</span>
        </button>
        <button className="dashboard-home-link" onClick={() => navigate("/home")}>
          <span aria-hidden="true">←</span> Home
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR MONEY, IN FOCUS</p>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">A clear view of your account activity.</p>
          </div>
          <div className="dashboard-controls">
            {accounts.length > 0 && (
              <label className="dashboard-account-picker">
                <span>Account</span>
                <select
                  value={selectedAccountNumber}
                  onChange={(event) => setSelectedAccountNumber(event.target.value)}
                >
                  {accounts.map((item) => (
                    <option key={item.accountNumber} value={item.accountNumber}>
                      {item.accountName || `Account ${item.accountNumber}`}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="dashboard-range-picker">
              <span>Period</span>
              <select
                value={selectedRange}
                onChange={(event) => setSelectedRange(event.target.value)}
              >
                {RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error && (
          <div className="dashboard-message is-error" role="alert">
            <span>{error}</span>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-state" role="status">Loading your account overview...</div>
        ) : !error && accounts.length === 0 ? (
          <div className="dashboard-empty">
            <span className="dashboard-empty-icon" aria-hidden="true">＋</span>
            <h2>Your dashboard starts with an account</h2>
            <p>Add an account to see balances, spending, and recent activity here.</p>
            <button onClick={() => navigate("/add-account")}>Add account</button>
          </div>
        ) : account ? (
          <>
            <section className="dashboard-metrics" aria-label="Account summary">
              <article className="dashboard-balance-metric">
                <p>Available balance</p>
                <strong>{formatMoney(account.currentBalance, account.currency)}</strong>
                <span>{account.accountName || `Account ${account.accountNumber}`}</span>
              </article>
              <article className="dashboard-metric">
                <p>Money in <span className="metric-icon is-income" aria-hidden="true">↙</span></p>
                <strong>{formatMoney(account.totalCredit || account.monthlyIncome, account.currency)}</strong>
                <span>{rangeLabel}</span>
              </article>
              <article className="dashboard-metric">
                <p>Money out <span className="metric-icon is-expense" aria-hidden="true">↗</span></p>
                <strong>{formatMoney(account.totalDebit || account.monthlyExpenses, account.currency)}</strong>
                <span>{rangeLabel}</span>
              </article>
              <article className="dashboard-metric">
                <p>Total amount</p>
                <strong className={netFlow < 0 ? "is-negative" : ""}>
                  {formatMoney(account.totalAmount || account.currentBalance, account.currency)}
                </strong>
                <span>{rangeLabel}</span>
              </article>
            </section>

            <section className="dashboard-lower-grid">
              <article className="dashboard-panel dashboard-trend-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <h2>Cash flow</h2>
                    <p>Income and spending over the last six months</p>
                  </div>
                  <div className="dashboard-legend" aria-label="Chart legend">
                    <span><i className="legend-income" />In</span>
                    <span><i className="legend-expense" />Out</span>
                  </div>
                </div>
                <div className="dashboard-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={account.monthlyTrend} barGap={5}>
                      <CartesianGrid vertical={false} stroke="#e8ece8" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#788078", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={55}
                        tick={{ fill: "#788078", fontSize: 11 }}
                        tickFormatter={(value) => Number(value).toLocaleString()}
                      />
                      <Tooltip
                        formatter={(value, name) => [formatMoney(value, account.currency), name === "income" ? "Money in" : "Money out"]}
                        labelFormatter={(label) => formatMonth(label)}
                        contentStyle={{ border: "1px solid #e4e8e2", borderRadius: 6 }}
                      />
                      <Bar dataKey="income" name="income" fill="#2f8f72" radius={[3, 3, 0, 0]} maxBarSize={24} />
                      <Bar dataKey="expenses" name="expenses" fill="#e18b67" radius={[3, 3, 0, 0]} maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="dashboard-panel dashboard-activity-panel">
                <div className="dashboard-panel-heading">
                  <div>
                    <h2>Recent activity</h2>
                    <p>Latest transactions on this account</p>
                  </div>
                  <span className="activity-count">{account.recentTransactions.length}</span>
                </div>
                {account.recentTransactions.length === 0 ? (
                  <div className="dashboard-no-activity">No transactions yet.</div>
                ) : (
                  <ul className="dashboard-activity-list">
                    {account.recentTransactions.map((transaction) => (
                      <li key={transaction.transactionId}>
                        <span className={`activity-symbol ${transaction.transactionType === "CREDIT" ? "is-credit" : "is-debit"}`} aria-hidden="true">
                          {transaction.transactionType === "CREDIT" ? "↙" : "↗"}
                        </span>
                        <span className="activity-description">
                          <strong>{transaction.comment || (transaction.transactionCategory || "Transaction").toLowerCase()}</strong>
                          <small>{formatDate(transaction.transactionDate)}</small>
                        </span>
                        <strong className={`activity-amount ${transaction.transactionType === "CREDIT" ? "is-credit" : ""}`}>
                          {transaction.transactionType === "CREDIT" ? "+" : "−"}
                          {formatMoney(transaction.amount, account.currency)}
                        </strong>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </section>

            <section className="dashboard-category-panel dashboard-panel" aria-label="Category spending summary">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Spending by category</h2>
                  <p>How much was spent in each category for {rangeLabel.toLowerCase()}</p>
                </div>
              </div>

              {(account.categorySpending || []).length === 0 ? (
                <div className="dashboard-no-activity">No spending recorded in this time range.</div>
              ) : (
                <ul className="dashboard-category-list">
                  {(account.categorySpending || []).map((item) => (
                    <li key={item.category} className="dashboard-category-item">
                      <span>{item.category}</span>
                      <strong>{formatMoney(item.totalAmount, account.currency)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default Dashboard;