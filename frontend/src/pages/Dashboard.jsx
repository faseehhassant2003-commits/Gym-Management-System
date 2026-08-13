import { useEffect,useState } from "react";
import api from "../api/api";

import MemberChart from "../components/MemberChart";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import RecentMembers from "../components/RecentMembers";

function Dashboard() {
  const [name] = useState("Faseeh");

const [summary, setSummary] = useState({
  totalMembers: 0,
  totalTrainers: 0,
  totalRevenue: 0,
  totalAttendance: 0,
});

useEffect(() => {
   api.get("/dashboard/summary") .then((response) => {
      setSummary(response.data);
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error);
    });
}, []);

  return (
    <div className="container-fluid">

      {/* Navbar */}
      <Navbar />

      <div className="row">

        {/* Sidebar */}
        <div className="col-3">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="col-9">

          <h2 className="mt-3">Welcome {name}</h2>

          <div className="row mt-4">

            <div className="col-md-6 mb-3">
           <DashboardCard
  title="Total Members"
  value={summary.totalMembers}
  icon="bi-people-fill"
  color="bg-primary"
/>

            </div>

            <div className="col-md-6 mb-3">
           <DashboardCard
  title="Total Trainers"
  value={summary.totalTrainers}
  icon="bi-person-workspace"
  color="bg-success"
/>
            </div>

            <div className="col-md-6 mb-3">
            <DashboardCard
  title="Attendance"
  value={summary.totalAttendance}
  icon="bi-calendar-check"
  color="bg-danger"
/>
            </div>

          </div>
          <RecentMembers />
       


<MemberChart/>
        </div>

      </div>

    </div>
  );
}

export default Dashboard ;