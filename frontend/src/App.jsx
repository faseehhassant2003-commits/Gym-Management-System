import Login from "./pages/Login";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import DietPlans from "./pages/DietPlans";
import WorkoutPlans from "./pages/WorkoutPlans";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path="/" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/members" element={<Members/>}/>
      <Route path="/trainers" element={<Trainers/>}/>
      <Route path="/attendance" element={<Attendance/>}/>
      <Route path="/diet" element={<DietPlans/>}/>
      <Route path="/workoutPlans" element={<WorkoutPlans />} />
        <Route path="/payments" element={<Payments/>}/>
 </Routes>
</BrowserRouter>
  );
}

export default App;