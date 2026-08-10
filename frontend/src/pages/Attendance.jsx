import Layout from "../layouts/Layout";
import { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../api/AttendanceApi";

import { getMembers } from "../api/memberApi";
import "./Attendance.css";

function Attendance() {
const [showQRModal, setShowQRModal] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [selectedMember, setSelectedMember] = useState("");
  const [members, setMembers] = useState([]);

  const [attendanceDate, setAttendanceDate] = useState("");
  const [status, setStatus] = useState("Present");

  const [editingAttendance, setEditingAttendance] = useState(null);

  const [attendance, setAttendance] = useState([]);

  // Date selected for viewing attendance
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // Get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    loadAttendance();
    loadMembers();
  }, []);

  async function loadAttendance() {
    try {
      const response = await getAttendance();
      setAttendance(response.data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  }

  async function loadMembers() {
    try {
      const response = await getMembers();
      setMembers(response.data);
    } catch (error) {
      console.error("Error loading members:", error);
    }
  }

  function editAttendance(record) {
    setSelectedMember(record.member.id);
    setAttendanceDate(record.attendanceDate);
    setStatus(record.status);

    setEditingAttendance(record.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this attendance?")) {
      try {
        await deleteAttendance(id);
        await loadAttendance();
      } catch (error) {
        console.error("Error deleting attendance:", error);
        alert("Failed to delete attendance");
      }
    }
  }

  function cancelAttendance() {
    setSelectedMember("");
    setAttendanceDate("");
    setStatus("Present");

    setEditingAttendance(null);
    setShowForm(false);
  }

  function openAddAttendanceForm() {
    setSelectedMember("");
    setAttendanceDate(selectedDate);
    setStatus("Present");
    setEditingAttendance(null);
    setShowForm(true);
  }

async function saveAttendance() {
  if (selectedMember === "") {
    alert("Please select a member");
    return;
  }

  if (attendanceDate === "") {
    alert("Please select date");
    return;
  }

  const newAttendance = {
    member: {
      id: selectedMember,
    },
    attendanceDate,
    status,
  };

  try {
    // If we are editing an existing record
    if (editingAttendance !== null) {
      await updateAttendance(editingAttendance, newAttendance);
    } else {
      // Check whether this member already has attendance
      // for the selected date
      const existingAttendance = attendance.find(
        (record) =>
          String(record.member.id) === String(selectedMember) &&
          record.attendanceDate === attendanceDate
      );

      if (existingAttendance) {
        // Update existing attendance instead of creating duplicate
        await updateAttendance(existingAttendance.id, newAttendance);
      } else {
        // No attendance exists for this member/date
        await addAttendance(newAttendance);
      }
    }

    await loadAttendance();

    setSelectedMember("");
    setAttendanceDate("");
    setStatus("Present");
    setEditingAttendance(null);
    setShowForm(false);

  } catch (error) {
    console.error("Error saving attendance:", error);
    alert("Failed to save attendance");
  }
}

  // Only show attendance for selected date
  const filteredAttendance = attendance.filter(
    (record) => record.attendanceDate === selectedDate
  );

  // Count present and absent
  const presentCount = filteredAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = filteredAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  function formatDate(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year.slice(-2)}`;
}

  return (
    <Layout>
      <div className="attendance-page">

        {/* Header */}
        <div className="attendance-header">
          <div>
            <h1>Attendance Management</h1>
            <p>
              Mark attendance manually or scan a member QR code to record
              presence.
            </p>
          </div>

          <div className="attendance-buttons">
       <button
  className="btn btn-outline-primary"
  onClick={() => setShowQRModal(true)}
>
  Scan QR Attendance
</button>

            <button
              className="btn btn-primary"
              onClick={openAddAttendanceForm}
            >
              + Mark Attendance
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="attendance-date-filter">
          <div>
            <label className="form-label">
              Select Date
            </label>

            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="attendance-summary">
            <div>
              <strong>{filteredAttendance.length}</strong>
              <span>Total</span>
            </div>

            <div>
              <strong>{presentCount}</strong>
              <span>Present</span>
            </div>

            <div>
              <strong>{absentCount}</strong>
              <span>Absent</span>
            </div>
          </div>
        </div>

        {/* Selected Date Heading */}
        <div className="selected-date-heading">
          <h3>
            Attendance for {formatDate(selectedDate)}
          </h3>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
  <div className="attendance-modal-overlay">

    <div className="attendance-modal">

      <div className="attendance-modal-header">
        <h4>
          {editingAttendance === null
            ? "Mark Attendance"
            : "Update Attendance"}
        </h4>

        <button
          className="attendance-modal-close"
          onClick={cancelAttendance}
        >
          ×
        </button>
      </div>

      <div className="attendance-modal-body">

        <select
          className="form-select mb-3"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">Select Member</option>

          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-control mb-3"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

      </div>

      <div className="attendance-modal-footer">

        <button
          className="btn btn-success"
          onClick={saveAttendance}
        >
          {editingAttendance === null
            ? "Save Attendance"
            : "Update Attendance"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={cancelAttendance}
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}

        {/* Attendance Table */}
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.member.name}</td>

                  <td>{formatDate(record.attendanceDate)}</td>

                  <td>{record.status}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editAttendance(record)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No attendance recorded for {selectedDate}
                </td>
              </tr>
            )}
          </tbody>
        </table>
{showQRModal && (
  <div className="attendance-modal-overlay">
    <div className="attendance-modal qr-modal">

      <div className="attendance-modal-header">
        <h4>Scan QR Attendance</h4>

        <button
          className="attendance-modal-close"
          onClick={() => setShowQRModal(false)}
        >
          ×
        </button>
      </div>

      <div className="attendance-modal-body">
        <QRScanner
          attendanceDate={selectedDate}
          onClose={() => setShowQRModal(false)}
          onAttendanceMarked={loadAttendance}
        />
      </div>

      <div className="attendance-modal-footer">
        <button
          className="btn btn-secondary"
          onClick={() => setShowQRModal(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
      </div>
    </Layout>
  );
}

export default Attendance;