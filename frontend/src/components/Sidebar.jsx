import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

  
  const role= localStorage.getItem("role");
  return (
    <div className="sidebar">
      <h4 className="text-center mb-4">Gym Management</h4>

      <ul className="nav flex-column">

        {/* Profile (Member) */}
        {role === "MEMBER" && (
          <li className="nav-item mb-2">
            <Link to="/profile" className="nav-link text-white">
              <i className="bi bi-person-circle me-2"></i>
              Profile
            </Link>
          </li>
        )}

        {/* Dashboard (Everyone) */}
        <li className="nav-item mb-2">
          <Link to="/dashboard" className="nav-link text-white">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </li>

        {/* ADMIN & TRAINER */}
        {(role === "ADMIN" || role === "TRAINER") && (
          <>
            <li className="nav-item mb-2">
              <Link to="/members" className="nav-link text-white">
                <i className="bi bi-people-fill me-2"></i>
                Members
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/attendance" className="nav-link text-white">
                <i className="bi bi-calendar-check me-2"></i>
                Attendance
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/WorkoutPlans" className="nav-link text-white">
                <i className="bi bi-robot me-2"></i>
                AI Workout
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/diet" className="nav-link text-white">
                <i className="bi bi-robot me-2"></i>
                AI Diet
              </Link>
            </li>
          </>
        )}

        {/* ADMIN ONLY */}
        {role === "ADMIN" && (
          <>
            <li className="nav-item mb-2">
              <Link to="/trainers" className="nav-link text-white">
                <i className="bi bi-person-workspace me-2"></i>
                Trainers
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/payments" className="nav-link text-white">
                <i className="bi bi-cash-stack me-2"></i>
                Payments
              </Link>
            </li>
            



            <li className="nav-item mb-2">
              <Link to="/users" className="nav-link text-white">
                <i className="bi bi-person-gear me-2"></i>
                Manage Users
              </Link>
            </li>
          </>
        )}

        {/* MEMBER ONLY */}
        {role === "MEMBER" && (
          <>
            <li className="nav-item mb-2">
              <Link to="/my-workout" className="nav-link text-white">
                <i className="bi bi-activity me-2"></i>
                My Workout
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/my-diet" className="nav-link text-white">
                <i className="bi bi-heart-pulse me-2"></i>
                My Diet
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/my-attendance" className="nav-link text-white">
                <i className="bi bi-calendar-check me-2"></i>
                My Attendance
              </Link>
            </li>

            <li className="nav-item mb-2">
              <Link to="/my-payments" className="nav-link text-white">
                <i className="bi bi-cash-stack me-2"></i>
                My Payments
              </Link>
            </li>
          </>
        )}

      </ul>
    </div>
  );
}

export default Sidebar;