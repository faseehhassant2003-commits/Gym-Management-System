import Layout from "../layouts/Layout";
import { useState, useEffect } from "react";

import {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../api/AttendanceApi";

import { getMembers } from "../api/memberApi";

function Attendance() {
  const [showForm, setShowForm] = useState(false);

  const [selectedMember, setSelectedMember] = useState("");
  const [members, setMembers] = useState([]);

  const [attendanceDate, setAttendanceDate] = useState("");
  const [status, setStatus] = useState("Present");

  const [editingAttendance, setEditingAttendance] = useState(null);

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadAttendance();
    loadMembers();
  }, []);

  async function loadAttendance() {
    const response = await getAttendance();
    setAttendance(response.data);
  }

  async function loadMembers() {
    const response = await getMembers();
    setMembers(response.data);
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
      await deleteAttendance(id);
      await loadAttendance();
    }
  }

  function cancelAttendance() {
    setSelectedMember("");
    setAttendanceDate("");
    setStatus("Present");

    setEditingAttendance(null);
    setShowForm(false);
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

    if (editingAttendance === null) {
      await addAttendance(newAttendance);
    } else {
      await updateAttendance(editingAttendance, newAttendance);
      setEditingAttendance(null);
    }

    await loadAttendance();

    setSelectedMember("");
    setAttendanceDate("");
    setStatus("Present");
    setShowForm(false);
  }

  return (
    <Layout>
          <h2>Attendance Management</h2>

          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowForm(true)}
          >
            + Mark Attendance
          </button>

          {showForm && (
            <div className="card p-3 mb-3">
              <h4>
                {editingAttendance === null
                  ? "Mark Attendance"
                  : "Update Attendance"}
              </h4>

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

              <button
                className="btn btn-success me-2"
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
          )}

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
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.member.name}</td>
                  <td>{record.attendanceDate}</td>
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
              ))}
            </tbody>
          </table>
     </Layout>
  );
}

export default Attendance;