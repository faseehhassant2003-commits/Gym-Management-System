import { Link } from "react-router-dom";
import "../styles/Login.css";

function Home() {
  return (
    <div className="login-page">

        <div className="login-shell">
          <div className="login-hero">
            <div className="login-badge">Fitness • Performance • Management</div>
            <h1 className="login-title">Built for strong gyms and focused teams</h1>
            <p className="login-description">
              Manage members, trainers, attendance, diet plans, workout programs, and payments from one polished dashboard.
              Start your fitness journey with an admin experience that looks modern and feels effortless.
            </p>

            <div className="home-actions">
              <Link to="/register" className="login-button home-cta">
                Join Today
              </Link>
              <Link to="/login" className="login-button home-secondary">
                Member Login
              </Link>
            </div>
          </div>

          <div className="login-card home-card">
            <div className="login-card-header">
              <div className="login-icon">🏋️</div>
              <h2 className="login-card-title">Everything your gym needs</h2>
              <p className="login-card-subtitle">
                A modern dashboard for tracking progress, managing members, and growing your community.
              </p>
            </div>

            <div className="home-feature-grid">
              <div className="home-feature-item">
                <h3>Member insights</h3>
                <p>Track attendance, progress, and engagement across your gym in one place.</p>
              </div>
              <div className="home-feature-item">
                <h3>Workout & diet</h3>
                <p>Deliver tailored plans and nutrition guidance with a beautifully organized workflow.</p>
              </div>
              <div className="home-feature-item">
                <h3>Payments simplified</h3>
                <p>Keep billing on time and manage subscriptions without clutter or confusion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;