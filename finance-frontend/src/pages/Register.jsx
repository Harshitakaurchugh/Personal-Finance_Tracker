import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api";
import "../css/Register.css";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await api.post("/auth/register", formData);
            setMessage(response.data || "Registration Successful");
            setIsRegistered(true);
        } catch (err) {
            setError(getApiErrorMessage(err, "Registration failed."));
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Personal Finance Tracker</h1>
                <h2>Create Account</h2>

                {isRegistered ? (
                    <div>
                        <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
                        <p>Please login now to go to the Home page and add your financial data.</p>
                        <Link to="/login">
                            <button type="button">Go to Login</button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="middleName"
                                placeholder="Middle Name"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="row">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="userName"
                                placeholder="Username"
                                value={formData.userName}
                                onChange={handleChange}
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        <button type="submit">Create Account</button>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                )}

                <p>
                    Already have an account?
                    <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;