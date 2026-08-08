import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (username === "") {
      setError("Please enter your username");
      return;
    }

    if (password === "") {
      setError("Please enter your password");
      return;
    }

    setError("");
    localStorage.removeItem("token");

    try {
      const response = await api.post("/auth/login", {
        username: username,
        password: password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        setError(response.data.message);
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");

      if (error.response) {
        setError(error.response.data.message || "Invalid username or password");
      } else {
        setError("Unable to connect to server");
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-hero">
          <div className="login-badge">Fitness • Performance • Management</div>
          <h1 className="login-title">Welcome back to your gym command center</h1>
          <p className="login-description">
            Manage members, trainers, payments, attendance, and workout plans from one polished dashboard.
          </p>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">🏋️</div>
            <h2 className="login-card-title">Gym Management Login</h2>
            <p className="login-card-subtitle">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label className="login-label">Username</label>
              <input
                type="text"
                className="form-control login-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="form-control login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-danger login-error">{error}</div>}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;