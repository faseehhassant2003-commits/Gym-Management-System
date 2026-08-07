import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar"
    >
      <h4 className="text-center mb-4"> Gym Management</h4>

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <Link to="/dashboard" className="nav-link text-white">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/members" className="nav-link text-white">
            <i className="bi bi-people-fill me-2"></i>
            Members
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/trainers" className="nav-link text-white">
            <i className="bi bi-person-workspace me-2"></i>
            Trainers
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/attendance" className="nav-link text-white">
            <i className="bi bi-calendar-check me-2"></i>
            Attendance
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/payments" className="nav-link text-white">
            <i className="bi bi-cash-stack me-2"></i>
            Payments
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

      </ul>
    </div>
  );
}

export default Sidebar;