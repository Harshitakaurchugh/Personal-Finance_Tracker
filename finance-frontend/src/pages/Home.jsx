import React, { useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";



function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Top Navigation */}
      <div className="navbar">
        <h2>💰 Personal Finance Tracker</h2>

        <div className="menu">
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          {menuOpen && (
            <div className="dropdown">
              <button>👤 Edit Profile</button>

              <button>🗑 Delete Account</button>

              <button>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}

      <div className="home-card">
        <h1>Welcome!</h1>

        <p>Select what you want to manage.</p>

        <div className="button-grid">
          <div className="menu-card">
            <button className="main-btn">
              🏦
              <span>Account Management</span>
            </button>

            <div className="sub-menu">
              <div
                className="sub-item"
                onClick={() => navigate("/add-account")}
              >
                ➕ Add Account
              </div>

              <div className="sub-item" 
              onClick={() => navigate("/modify-account")}
              >✏ Modify Account</div>

              <div className="sub-item" onClick={() => navigate("/delete-account")}>
                🗑 Delete Account
              </div>
            </div>
          </div>

          {/* Transaction Management */}

          <div className="menu-card">
            <button className="main-btn">
              💳
              <span>Transaction Management</span>
            </button>

            <div className="sub-menu">
              <div
                className="sub-item"
                onClick={() => navigate("/transactions")}
              >
                💸 Add Transaction
              </div>

              <div className="sub-item" 
              onClick={() => navigate("/modify-transaction")}
              >✏ Modify Transaction</div>

              <div className="sub-item" onClick={() => navigate("/delete-transaction")}>
                🗑 Delete Transaction
              </div>
            </div>
          </div>

          {/* Profile Management */}

          <div className="menu-card">
            <button className="main-btn">
              👤
              <span>Profile Management</span>
            </button>

            <div className="sub-menu">
              <div className="sub-item" onClick={() => navigate("/dashboard")}>📊 Dashboard</div>

              <div className="sub-item">📈 Reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
