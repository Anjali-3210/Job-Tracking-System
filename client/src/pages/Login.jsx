import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please enter both email and password.");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    navigate("/dashboard");
  } catch (error) {
    console.log("Login Failed");
    console.log(error.response?.data || error.message);
    toast.error("Invalid email or password");
  } finally {
    setLoading(false);
  }
};
  
  return (
  <div className="login-page">
    <div className="login-card">

      <h1 className="login-title">📋 Job Tracker</h1>

      <p className="login-subtitle">
        Track your job applications efficiently
      </p>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        </div>

        <button
        type="submit"
        className="login-btn"
        disabled={loading}>
        {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  </div>
);
}

export default Login;