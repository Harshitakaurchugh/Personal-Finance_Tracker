import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api";
import "../css/AddTransaction.css";

const AddTransaction = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountValidated, setAccountValidated] = useState(false);
  const [transaction, setTransaction] = useState({
    transactionAmount: "",
    transactionType: "",
    transactionDate: "",
    transactionCategory: "",
    comment: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateAccount = async (event) => {
    event.preventDefault();
    const parsedAccountNumber = Number(accountNumber.trim());

    if (!Number.isSafeInteger(parsedAccountNumber) || parsedAccountNumber <= 0) {
      setError("Enter a valid account number.");
      setAccountValidated(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      setAccountValidated(false);
      await api.get(`/transactions/validate/${parsedAccountNumber}`);
      setAccountValidated(true);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          err.response?.status === 403
            ? "You are not authorized to use this account."
            : "Account validation failed. Check the account number and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = (event) => {
    const { name, value } = event.target;
    setTransaction((current) => ({ ...current, [name]: value }));
  };

  const submitTransaction = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const response = await api.post("/transactions/addtransaction", {
        ...transaction,
        accountNumber: Number(accountNumber),
        transactionAmount: Number(transaction.transactionAmount)
      });
      setSuccessMessage(
        typeof response.data === "string"
          ? response.data
          : "Transaction added successfully."
      );
      setTransaction({
        transactionAmount: "",
        transactionType: "",
        transactionDate: "",
        transactionCategory: "",
        comment: ""
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to add transaction."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-transaction-page">
      <div className="add-transaction-shell">
        <header className="add-transaction-header">
        <button
          type="button"
          className="add-transaction-back"
          onClick={() => navigate("/home")}
        >
          <span aria-hidden="true">←</span> Home
        </button>
        <p className="add-transaction-kicker">TRANSACTION MANAGEMENT</p>
        <h1>Add Transaction</h1>
        </header>

        <ol className="add-transaction-steps" aria-label="Transaction steps">
          <li className={accountValidated ? "is-complete" : "is-current"}>
            <span>01</span> Verify account
          </li>
          <li className={accountValidated ? "is-current" : ""}>
            <span>02</span> Transactions
          </li>
        </ol>

        <form className="add-transaction-account-form" onSubmit={validateAccount}>
          <h3>Verify Account</h3>
          <label htmlFor="account-number">
            Account Number
          </label>
          <input
            id="account-number"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Enter account number"
            value={accountNumber}
            onChange={(event) => {
              setAccountNumber(event.target.value);
              setAccountValidated(false);
              setError("");
              setSuccessMessage("");
            }}
            required
          />
          <button
            type="submit"
            className="add-transaction-validate"
            disabled={loading}
          >
            {loading ? "Validating..." : "Validate Account"}
          </button>
        </form>

        {error && <div className="add-transaction-message is-error" role="alert">{error}</div>}
        {successMessage && <div className="add-transaction-message is-success" role="status">{successMessage}</div>}

        {accountValidated && (
          <form className="add-transaction-details" onSubmit={submitTransaction}>
            <h3>Add Your Transaction</h3>
            <div className="add-transaction-field">
              <label htmlFor="transaction-amount">Amount</label>
              <input
                id="transaction-amount"
                name="transactionAmount"
                type="number"
                min="1"
                step="1"
                value={transaction.transactionAmount}
                onChange={updateTransaction}
                required
              />
            </div>
            <div className="add-transaction-field">
              <label htmlFor="transaction-type">Type</label>
              <select
                id="transaction-type"
                name="transactionType"
                value={transaction.transactionType}
                onChange={updateTransaction}
                required
              >
                <option value="">Select type</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
            </div>
            <div className="add-transaction-field">
              <label htmlFor="transaction-date">Date</label>
              <input
                id="transaction-date"
                name="transactionDate"
                type="date"
                value={transaction.transactionDate}
                onChange={updateTransaction}
                required
              />
            </div>
            <div className="add-transaction-field">
              <label htmlFor="transaction-category">Category</label>
              <select
                id="transaction-category"
                name="transactionCategory"
                value={transaction.transactionCategory}
                onChange={updateTransaction}
                required
              >
                <option value="">Select category</option>
                <option value="FOOD">Food</option>
                <option value="SHOPPING">Shopping</option>
                <option value="TRAVEL">Travel</option>
                <option value="BILLS">Bills</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="SALARY">Salary</option>
                <option value="INVESTMENT">Investment</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="add-transaction-field is-wide">
              <label htmlFor="transaction-comment">Comment</label>
              <textarea
                id="transaction-comment"
                name="comment"
                value={transaction.comment}
                onChange={updateTransaction}
                placeholder="Optional note"
              />
            </div>
            <button
              type="submit"
              className="add-transaction-submit"
              disabled={loading}
            >
              {loading ? "Adding Transaction..." : "Add Transaction"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AddTransaction;