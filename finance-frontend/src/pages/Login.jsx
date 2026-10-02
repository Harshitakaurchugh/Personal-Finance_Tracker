import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api";
import "../css/Login.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login", formData);
            sessionStorage.setItem("token", response.data.token);
            navigate("/home");
        } catch (err) {
            setError(getApiErrorMessage(err, "Login failed."));
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Personal Finance Tracker</h1>
                <h2>Welcome Back</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <button type="submit">Sign In</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>

                <p>
                    Don't have an account?
                    <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;