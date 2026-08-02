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
                   
                }}
            >
                {children}
            </div>
        </>
    );
}

export default Layout;