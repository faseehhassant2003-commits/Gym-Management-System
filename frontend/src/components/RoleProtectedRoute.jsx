import {Navigate} from "react-router-dom";

function RoleProtectedRoute({ children, allowedRoles }) {
    const userRole = localStorage.getItem("role");

    if(!userRole){
        return <Navigate to="/" replace />;
    }
    if(!allowedRoles.includes(userRole)){
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
export default RoleProtectedRoute;