import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Welcome.css";

function Welcome() {

    const navigate = useNavigate();

    return (
        <div className="welcome-container">

            <div className="overlay">

                <div className="welcome-card">

                    <h1>💰 Personal Finance Tracker</h1>

                    <p>
                        Track your income, monitor expenses,
                        save more and achieve your financial goals.
                    </p>

                    <div className="button-group">

                        <button
                            className="login-btn"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>

                        <button
                            className="register-btn"
                            onClick={() => navigate("/register")}
                        >
                            Sign Up
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Welcome;