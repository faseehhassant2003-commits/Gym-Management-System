import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIFitnessAssistant from "../pages/AIFitnessAssistant";
import "./Layout.css";

function Layout({ children }) {

    const role = localStorage.getItem("role");

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

            {/* MEMBER ONLY AI CHATBOT */}
            {role === "MEMBER" && <AIFitnessAssistant />}
        </>
    );
}

export default Layout;