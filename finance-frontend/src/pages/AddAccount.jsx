import React, { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../services/api";
import "../css/AddAccount.css";

function AddAccount() {

  const [currencies, setCurrencies] = useState([]);

  const [account, setAccount] = useState({
    accountNumber: "",
    accountHolderName: "",
    accountName: "",
    accountType: "",
    currency: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    openingBalance: "",
    accountHolderID: "",
    primary: false
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api
      .get("/api/currencies")
      .then((response) => {
        setCurrencies(response.data);
      })
      .catch((error) => {
        setErrorMessage(getApiErrorMessage(error, "Unable to load currencies."));
      });
  }, []);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    // Clear messages when user edits fields
    setErrorMessage("");
    setSuccessMessage("");

    setAccount({
      ...account,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!account.accountNumber) {
      setErrorMessage("Account Number is required");
      return;
    }

    console.log("AddAccount submit", { tokenPresent: !!token, account });

    try {
      const response = await api.post("/accounts/addaccount", account);

      console.log("AddAccount response", response.data);
      setSuccessMessage(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      setErrorMessage("");

    } catch (error) {
      console.error("AddAccount request failed", error?.response?.data);
      setErrorMessage(getApiErrorMessage(error, "Unable to save account."));
      setSuccessMessage("");
    }

  };

  return (

    <div className="account-container">

      <form className="account-form" onSubmit={handleSubmit}>

        <h2>Add New Account</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <input
          type="number"
          name="accountNumber"
          placeholder="Account Number"
          value={account.accountNumber}
          onChange={handleChange}
        />

        <input
          type="text"
          name="accountHolderName"
          placeholder="Account Holder Name"
          value={account.accountHolderName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="accountName"
          placeholder="Account Name"
          value={account.accountName}
          onChange={handleChange}
        />

        <select
          name="accountType"
          value={account.accountType}
          onChange={handleChange}
        >
          <option value="">Select Account Type</option>
          <option value="SAVINGS">Savings</option>
          <option value="CURRENT">Current</option>
          <option value="FD">Fixed Deposit</option>
        </select>

        <div className="form-group">

          <label>Currency</label>

          <select
            name="currency"
            value={account.currency}
            onChange={handleChange}
          >

            <option value="">Select Currency</option>

            {currencies.map((currency) => (

              <option
                key={currency.code}
                value={currency.code}
              >
                {currency.code} - {currency.name}
              </option>

            ))}

          </select>

        </div>

        <input
          type="text"
          name="bankName"
          placeholder="Bank Name"
          value={account.bankName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="branchName"
          placeholder="Branch Name"
          value={account.branchName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="ifscCode"
          placeholder="IFSC Code"
          value={account.ifscCode}
          onChange={handleChange}
        />

        <input
          type="number"
          name="openingBalance"
          placeholder="Opening Balance"
          value={account.openingBalance}
          onChange={handleChange}
        />

        <input
          type="number"
          name="accountHolderID"
          placeholder="Account Holder ID"
          value={account.accountHolderID}
          onChange={handleChange}
        />

        <div className="checkbox-container">

          <input
            type="checkbox"
            id="primary"
            name="primary"
            checked={account.primary}
            onChange={handleChange}
          />

          <label htmlFor="primary">
            Primary Account
          </label>

        </div>

        <button type="submit">
          Save Account
        </button>

      </form>

    </div>

  );

}

export default AddAccount;