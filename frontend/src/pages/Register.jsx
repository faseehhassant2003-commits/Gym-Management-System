import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function RegisterMember() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim() === "") {
      setError("Please enter your full name.");
      return;
    }

    if (email.trim() === "") {
      setError("Please enter your email address.");
      return;
    }

    if (phone.trim() === "") {
      setError("Please enter your phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess("Your account details look good. Backend integration can be added next.");
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-hero">
          <div className="login-badge">New Member • Join the Club</div>
          <h1 className="login-title">Create your gym profile in minutes</h1>
          <p className="login-description">
            Sign up to manage memberships, track attendance, and stay connected with your fitness journey.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">✓ Quick onboarding</div>
            <div className="register-benefit">✓ Secure account setup</div>
            <div className="register-benefit">✓ Clean dashboard experience</div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">💪</div>
            <h2 className="login-card-title">Create Member Account</h2>
            <p className="login-card-subtitle">Start your fitness journey today</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="login-form-group">
              <label className="login-label">Full name</label>
              <input
                className="form-control login-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Email</label>
              <input
                type="email"
                className="form-control login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Phone</label>
              <input
                type="tel"
                className="form-control login-input"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="form-control login-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label className="login-label">Confirm password</label>
              <input
                type="password"
                className="form-control login-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <div className="alert alert-danger login-error">{error}</div>}
            {success && <div className="alert alert-success login-error">{success}</div>}

            <button type="submit" className="login-button">
              Create account
            </button>
          </form>

          <div className="register-footer">
            Already have an account?
            <Link to="/login" className="register-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterMember;