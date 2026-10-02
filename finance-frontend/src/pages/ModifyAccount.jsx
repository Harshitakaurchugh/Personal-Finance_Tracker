import React, { useState } from "react";
import api, { getApiErrorMessage } from "../services/api";
import "../css/ModifyAccount.css";

function ModifyAccount() {
    const [accountNumber, setAccountNumber] = useState("");
    const [account, setAccount] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setAccount((currentAccount) => ({
            ...currentAccount,
            [field]: value
        }));
    };

    const fetchAccount = async () => {
        if (!accountNumber.trim()) {
            setError("Please enter an account number.");
            setAccount(null);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");
            setAccount(null);

            const response = await api.get(`/accounts/${accountNumber.trim()}`);
            setAccount(response.data);

        } catch (err) {
            console.error("Fetch account error:", err);

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


    const updateAccount = async () => {
        if (!account) {
            setError("Please fetch an account first.");
            return;
        }

        try {
            setError("");
            setSuccessMessage("");
            setLoading(true);

            const payload = {
                accountNumber: account.accountNumber,
                accountHolderName: account.accountHolderName || "",
                accountName: account.accountName || "",
                accountType: account.accountType || "",
                currency: account.currency || "",
                bankName: account.bankName || "",
                branchName: account.branchName || "",
                ifscCode: account.ifscCode || "",
                openingBalance: account.openingBalance ?? null,
                accountHolderID: account.accountHolderID ?? null,
                primary: Boolean(account.primary)
            };

            const response = await api.patch(
                `/accounts/modifyaccount/accounts/${account.accountNumber}`,
                payload
            );

            setSuccessMessage(
                typeof response.data === "string"
                    ? response.data
                    : "Account updated successfully."
            );

        } catch (err) {
            console.error(
                "Modify account error:",
                err.response?.data
            );

            setError(getApiErrorMessage(err, "Unable to update account."));

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="modify-account-container">

            <div className="modify-account-wrapper">

                <h2>Modify Account</h2>

                {/* Search Account Section */}

                <div className="account-search-box">

                    <h3>Find Your Account</h3>

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
                        className="fetch-button"
                        onClick={fetchAccount}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Fetch Account"}
                    </button>

                </div>


                {/* Error Message */}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}



                {/* Account Details */}

                {account && (
                    <div className="account-details">

                        <h3>Account Details</h3>


                        {/* Non-editable Details */}

                        <div className="account-info">

                            <div className="info-row">
                                <span>Account Number</span>

                                <strong>
                                    {account.accountNumber}
                                </strong>
                            </div>


                            <div className="info-row">
                                <span>Bank Name</span>

                                <strong>
                                    {account.bankName || "N/A"}
                                </strong>
                            </div>


                            <div className="info-row">
                                <span>Current Balance</span>

                                <strong>
                                    {account.currentBalance ?? "N/A"}
                                </strong>
                            </div>


                            <div className="info-row">
                                <span>Currency</span>

                                <strong>
                                    {account.currency || "N/A"}
                                </strong>
                            </div>

                        </div>


                        <div className="editable-heading">
                            Editable Details
                        </div>


                        {/* Account Holder Name */}

                        <div className="form-group">

                            <label>
                                Account Holder Name
                            </label>

                            <input
                                type="text"
                                value={
                                    account.accountHolderName || ""
                                }
                                onChange={(e) =>
                                    setAccount({
                                        ...account,
                                        accountHolderName:
                                            e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* Branch Name */}

                        <div className="form-group">

                            <label>
                                Branch Name
                            </label>

                            <input
                                type="text"
                                value={account.branchName || ""}
                                onChange={(e) =>
                                    setAccount({
                                        ...account,
                                        branchName: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* Account Name */}

                        <div className="form-group">

                            <label>
                                Account Name
                            </label>

                            <input
                                type="text"
                                value={account.accountName || ""}
                                onChange={(e) =>
                                    setAccount({
                                        ...account,
                                        accountName: e.target.value
                                    })
                                }
                            />

                        </div>


                        {/* Account Type */}

                        <div className="form-group">

                            <label>
                                Account Type
                            </label>

                            <select
                                value={account.accountType || ""}
                                onChange={(e) =>
                                    setAccount({
                                        ...account,
                                        accountType: e.target.value
                                    })
                                }
                            >
                                <option value="">
                                    Select Account Type
                                </option>

                                <option value="SAVINGS">
                                    Savings
                                </option>

                                <option value="CURRENT">
                                    Current
                                </option>

                            </select>

                        </div>


                        <button
                            type="button"
                            className="update-button"
                            onClick={updateAccount}
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Update Account"}
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default ModifyAccount;