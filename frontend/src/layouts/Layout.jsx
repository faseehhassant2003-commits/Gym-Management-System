import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./Layout.css";

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <Sidebar />

            <div
            style={{
        marginTop: "80px",
        marginLeft: "280px",
        padding: "30px",
        minHeight: "calc(100vh - 80px)",
        boxSizing: "border-box",
    }}
            >
                {children}
            </div>
        </>
    );
}

export default Layout;