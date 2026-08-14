import React, { useEffect, useState } from "react";
import "./MyAttendance.css";

function MyAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem("token");

          const response = await fetch(
    `${import.meta.env.VITE_API_URL}/attendance/my`,
    {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
);

            if (!response.ok) {
                throw new Error("Failed to fetch attendance");
            }

            const data = await response.json();
            setAttendance(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load attendance");
        } finally {
            setLoading(false);
        }
    };

    const totalVisits = attendance.filter(
        (item) => item.status?.toLowerCase() === "present"
    ).length;

    const presentCount = attendance.filter(
        (item) => item.status?.toLowerCase() === "present"
    ).length;

    const attendanceRate =
        attendance.length > 0
            ? Math.round((presentCount / attendance.length) * 100)
            : 0;

    const lastVisit =
        attendance.length > 0 ? attendance[0].attendanceDate : "No visits yet";

    if (loading) {
        return (
            <div className="attendance-page">
                <div className="attendance-loading">
                    Loading attendance...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="attendance-page">
                <div className="attendance-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="attendance-page">

            <div className="attendance-header">
                <div>
                    <h1>My Attendance</h1>
                    <p>Track your gym attendance and consistency.</p>
                </div>
            </div>

            <div className="attendance-stats">

                <div className="attendance-card">
                    <div className="attendance-icon">🔥</div>
                    <div>
                        <span>Total Visits</span>
                        <h2>{totalVisits}</h2>
                    </div>
                </div>

                <div className="attendance-card">
                    <div className="attendance-icon">📊</div>
                    <div>
                        <span>Attendance Rate</span>
                        <h2>{attendanceRate}%</h2>
                    </div>
                </div>

                <div className="attendance-card">
                    <div className="attendance-icon">📅</div>
                    <div>
                        <span>Last Visit</span>
                        <h2>{lastVisit}</h2>
                    </div>
                </div>

            </div>

            <div className="attendance-history">

                <div className="history-header">
                    <h2>Attendance History</h2>
                    <span>{attendance.length} records</span>
                </div>

                {attendance.length === 0 ? (
                    <div className="no-attendance">
                        <div className="empty-icon">📅</div>
                        <h3>No attendance records</h3>
                        <p>
                            Your gym attendance will appear here once you check in.
                        </p>
                    </div>
                ) : (
                    <div className="attendance-table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {attendance.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.attendanceDate}</td>

                                        <td>
                                            <span
                                                className={`status-badge ${
                                                    item.status?.toLowerCase() ===
                                                    "present"
                                                        ? "present"
                                                        : "absent"
                                                }`}
                                            >
                                                <span className="status-dot"></span>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

        </div>
    );
}

export default MyAttendance;