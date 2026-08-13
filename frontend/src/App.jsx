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


function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path="/" element={<Home/>}/>
 <Route path="/login" element={<Login />} />
 <Route path="/register" element={<Register />} />
 <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
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
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Layout>
        <Profile />
      </Layout>
    </ProtectedRoute>
  }
/>
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
  path="/qr-scanner"
  element={
    <ProtectedRoute>
      <RoleProtectedRoute allowedRoles={["ADMIN", "TRAINER"]}>
        <Layout>
          <QRScanner />
        </Layout>
      </RoleProtectedRoute>
    </ProtectedRoute>
  }
/>

<Route
    path="/members"
    element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={["ADMIN", "TRAINER"]}>
            <Members />
          </RoleProtectedRoute>
        </ProtectedRoute>
    }
/>
<Route
    path="/trainers"
    element={
        <ProtectedRoute>
            <Trainers />
        </ProtectedRoute>
    }
/>     <Route
    path="/attendance"
    element={
        <ProtectedRoute>
            <Attendance />
        </ProtectedRoute>
    }
/>
      <Route
    path="/diet"
    element={
        <ProtectedRoute>
            <DietPlans />
        </ProtectedRoute>
    }
/>
<Route
  path="/workoutplans"
  element={
    <RoleProtectedRoute
      allowedRoles={["ADMIN", "TRAINER", "MEMBER"]}
    >
      <WorkoutPlans />
    </RoleProtectedRoute>
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
<Route
    path="*"
    element={
        <div style={{ padding: "50px" }}>
            <h1>ROUTER IS WORKING</h1>
            <p>Current URL: {window.location.pathname}</p>
        </div>
    }
/>

    
 </Routes>
</BrowserRouter>
  );
}

export default App;