import ProtectedRoute from "./components/ProtectedRoute";
import ManageUsers from "./pages/ManageUsers";
import WorkoutPlans from "./pages/WorkoutPlans";
import Login from "./pages/Login";
import MyPayments from "./pages/MyPayments";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import Attendance from "./pages/Attendance";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import DietPlans from "./pages/DietPlans";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import QRScanner from "./pages/QRScanner";
import Subscription from "./pages/Subscription";
import Layout from "./layouts/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Home from "./pages/Home";
import MemberHome from "./pages/MemberHome";
import MyAttendance from "./pages/MyAttendance";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Pages */}
                <Route path="/" element={<Home />} />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= ADMIN / TRAINER DASHBOARD ================= */}
<Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["ADMIN", "TRAINER"]}>
                <Layout>
                    <Dashboard />
                </Layout>
            </RoleProtectedRoute>
        </ProtectedRoute>
    }
/>


                {/* ================= MEMBER HOME ================= */}

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                                <Layout>
                                    <MemberHome />
                                </Layout>
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= MEMBER PROFILE ================= */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                                <Layout>
                                    <Profile />
                                </Layout>
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= MEMBER ATTENDANCE ================= */}

                <Route
                    path="/my-attendance"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                                <Layout>
                                    <MyAttendance />
                                </Layout>
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= MEMBER PAYMENTS ================= */}

                <Route
                    path="/my-payments"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                                <MyPayments />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= MEMBER SUBSCRIPTION ================= */}

                <Route
                    path="/subscription"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                                <Subscription />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />

{/* ================= MEMBER AI WORKOUT ================= */}

<Route
    path="/workoutplans"
    element={
        <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                <Layout>
                    <WorkoutPlans />
                </Layout>
            </RoleProtectedRoute>
        </ProtectedRoute>
    }
/>
                {/* ================= ADMIN / TRAINER ================= */}

                <Route
                    path="/members"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute
                                allowedRoles={["ADMIN", "TRAINER"]}
                            >
                                <Members />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute
                                allowedRoles={["ADMIN", "TRAINER"]}
                            >
                                <Attendance />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


        {/* ================= MEMBER AI DIET ================= */}

<Route
    path="/diet"
    element={
        <ProtectedRoute>
            <RoleProtectedRoute allowedRoles={["MEMBER"]}>
                <Layout>
                    <DietPlans />
                </Layout>
            </RoleProtectedRoute>
        </ProtectedRoute>
    }
/>


                <Route
                    path="/qr-scanner"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute
                                allowedRoles={["ADMIN", "TRAINER"]}
                            >
                                <Layout>
                                    <QRScanner />
                                </Layout>
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= TRAINERS ================= */}

                <Route
                    path="/trainers"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute
                                allowedRoles={["ADMIN", "TRAINER"]}
                            >
                                <Trainers />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= ADMIN ONLY ================= */}

                <Route
                    path="/subscription-plans"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                                <SubscriptionPlans />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                                <ManageUsers />
                            </RoleProtectedRoute>
                        </ProtectedRoute>
                    }
                />


                {/* ================= 404 ================= */}

                <Route
                    path="*"
                    element={
                        <div style={{ padding: "50px" }}>
                            <h1>Page Not Found</h1>
                            <p>
                                The page you are looking for does not exist.
                            </p>
                        </div>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;