import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        navigate("/");
    }

    return (
        <nav className="navbar navbar-dark bg-dark fixed-top">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <span className="navbar-brand mb-0 h1">GYM SYSTEM</span>
                    {role && (
                        <span className="badge bg-secondary text-uppercase ms-2" style={{fontSize: '0.75rem', padding: '0.4rem 0.6rem'}}>
                            {role}
                        </span>
                    )}
                </div>

                <div className="d-flex align-items-center">
                    <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;