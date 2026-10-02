import React, { useState } from "react";
import api, { getApiErrorMessage } from "../services/api";
import "../css/TransactionManagement.css";

function TransactionManagement() {

    const [accountNumber, setAccountNumber] = useState("");
    const [account, setAccount] = useState(null);

    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [transactionCategory, setTransactionCategory] = useState("");
    const [comment, setComment] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // Fetch Account

    const fetchAccount = async () => {

        if (!accountNumber.trim()) {
            setError("Please enter an account number.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccessMessage("");
            setAccount(null);

            const response = await api.get(
                `/accounts/${accountNumber}`
            );

            console.log("Account fetched:", response.data);

            setAccount(response.data);

        } catch (err) {

            console.error(
                "Fetch account error:",
                err.response?.data
            );

            setAccount(null);

            setError(
                getApiErrorMessage(
                    err,
                    err.response?.status === 403
                        ? "You are not authorized to access this account."
                        : err.response?.status === 404
                            ? "Account not found."
                            : "Unable to fetch account details."
                )
            );

        } finally {

            setLoading(false);

        }
    };


    // Add Transaction

    const addTransaction = async () => {

        if (!transactionAmount) {
            setError("Please enter transaction amount.");
            return;
        }

        if (!transactionType) {
            setError("Please select transaction type.");
            return;
        }

        if (!transactionDate) {
            setError("Please select transaction date.");
            return;
        }

        if (!transactionCategory) {
            setError("Please select transaction category.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccessMessage("");

            const payload = {

                accountNumber: account.accountNumber,

                transactionAmount: Number(transactionAmount),

                transactionType: transactionType,

                transactionDate: transactionDate,

                transactionCategory: transactionCategory,

                comment: comment
            };

            console.log(
                "Transaction payload:",
                payload
            );


            const response = await api.post(
                "/transactions/add",
                payload
            );


            setSuccessMessage(
                typeof response.data === "string"
                    ? response.data
                    : "Transaction added successfully."
            );


            // Clear transaction form

            setTransactionAmount("");
            setTransactionType("");
            setTransactionDate("");
            setTransactionCategory("");
            setComment("");

        } catch (err) {

            console.error(
                "Transaction error:",
                err.response?.data
            );

            setError(getApiErrorMessage(err, "Unable to add transaction."));

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="transaction-container">

            <div className="transaction-wrapper">


                <h2>
                    💸 Transaction Management
                </h2>


                {/* Account Search Section */}

                <div className="account-search-section">

                    <h3>
                        Select Account
                    </h3>

                    <input
                        type="text"
                        placeholder="Enter Account Number"
                        value={accountNumber}
                        onChange={(e) =>
                            setAccountNumber(e.target.value)
                        }
                    />

                    <button
                        type="button"
                        className="fetch-account-button"
                        onClick={fetchAccount}
                        disabled={loading}
                    >

                        {loading
                            ? "Loading..."
                            : "Fetch Account"
                        }

                    </button>

                </div>


                {/* Error Message */}

                {error && (

                    <div className="transaction-error">

                        {error}

                    </div>

                )}


                {/* Success Message */}

                {successMessage && (

                    <div className="transaction-success">

                        {successMessage}

                    </div>

                )}


                {/* Account Details */}

                {account && (

                    <>

                        <div className="selected-account">

                            <h3>
                                🏦 Selected Account
                            </h3>


                            <div className="account-detail-row">

                                <span>
                                    Account Number
                                </span>

                                <strong>
                                    {account.accountNumber}
                                </strong>

                            </div>


                            <div className="account-detail-row">

                                <span>
                                    Account Name
                                </span>

                                <strong>
                                    {account.accountName || "N/A"}
                                </strong>

                            </div>


                            <div className="account-detail-row">

                                <span>
                                    Bank Name
                                </span>

                                <strong>
                                    {account.bankName || "N/A"}
                                </strong>

                            </div>


                            <div className="account-detail-row">

                                <span>
                                    Current Balance
                                </span>

                                <strong>
                                    {account.currentBalance ?? "N/A"}
                                </strong>

                            </div>

                        </div>


                        {/* Transaction Form */}

                        <div className="transaction-form">

                            <h3>
                                Add Transaction
                            </h3>


                            {/* Transaction Amount */}

                            <div className="transaction-form-group">

                                <label>
                                    Transaction Amount
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={transactionAmount}
                                    onChange={(e) =>
                                        setTransactionAmount(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* Transaction Type */}

                            <div className="transaction-form-group">

                                <label>
                                    Transaction Type
                                </label>

                                <select
                                    value={transactionType}
                                    onChange={(e) =>
                                        setTransactionType(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Transaction Type
                                    </option>

                                    <option value="INCOME">
                                        Income
                                    </option>

                                    <option value="EXPENSE">
                                        Expense
                                    </option>

                                </select>

                            </div>


                            {/* Transaction Date */}

                            <div className="transaction-form-group">

                                <label>
                                    Transaction Date
                                </label>

                                <input
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) =>
                                        setTransactionDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* Transaction Category */}

                            <div className="transaction-form-group">

                                <label>
                                    Transaction Category
                                </label>

                                <select
                                    value={transactionCategory}
                                    onChange={(e) =>
                                        setTransactionCategory(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="FOOD">
                                        Food
                                    </option>

                                    <option value="SHOPPING">
                                        Shopping
                                    </option>

                                    <option value="TRAVEL">
                                        Travel
                                    </option>

                                    <option value="BILLS">
                                        Bills
                                    </option>

                                    <option value="ENTERTAINMENT">
                                        Entertainment
                                    </option>

                                    <option value="SALARY">
                                        Salary
                                    </option>

                                    <option value="INVESTMENT">
                                        Investment
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>


                            {/* Comment */}

                            <div className="transaction-form-group">

                                <label>
                                    Comment
                                </label>

                                <textarea
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(e.target.value)
                                    }
                                />

                            </div>


                            <button
                                type="button"
                                className="add-transaction-button"
                                onClick={addTransaction}
                                disabled={loading}
                            >

                                {loading
                                    ? "Adding Transaction..."
                                    : "Add Transaction"
                                }

                            </button>

                        </div>

                    </>

                )}

            </div>

        </div>

    );
}

export default TransactionManagement;