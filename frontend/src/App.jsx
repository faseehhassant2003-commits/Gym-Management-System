import ProtectedRoute from "./components/ProtectedRoute";

import WorkoutPlans from "./pages/WorkoutPlans";
import Login from "./pages/Login";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import DietPlans from "./pages/DietPlans";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path="/" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
 <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/members"
    element={
        <ProtectedRoute>
            <Members />
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
    path="/WorkoutPlans"
    element={
        <ProtectedRoute>
            <WorkoutPlans />
        </ProtectedRoute>
    }
/>


       <Route
    path="/payments"
    element={
        <ProtectedRoute>
            <Payments />
        </ProtectedRoute>
    }
/>
 </Routes>
</BrowserRouter>
  );
}

export default App;