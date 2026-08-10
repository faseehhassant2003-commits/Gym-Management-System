import Layout from "../layouts/Layout";
import { useState, useEffect } from "react";

import { getMembers, addMember, updateMember, deleteMember as deleteMemberApi } from "../api/memberApi";
import { toast } from "react-toastify";
import "./Members.css";

function Members() {
  const [createLogin, setCreateLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [age, setAge] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [membership, setMembership] = useState("Gold");
  const [editingId, setEditingId] = useState(null);
  const [members, setMembers] = useState([]);
const [viewingMember, setViewingMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await getMembers();
      setMembers(response.data);
    } catch (error) {
      toast.error(error.response?.data || "Failed to load members");
    }
  };

  const resetForm = () => {
    setMemberName("");
    setAge("");
    setPhone("");
    setHeight("");
    setWeight("");
    setMembership("Gold");
    setEditingId(null);
    setCreateLogin(false);
    setEmail("");
    setPassword("");
  };

  async function saveMember() {
    if (memberName.trim().length < 3) {
      toast.warning("Name must contain at least 3 characters");
      return;
    }

    if (age < 16 || age > 100) {
      toast.warning("Age must be between 16 and 100");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.warning("Phone number must contain exactly 10 digits");
      return;
    }

    if (!height || Number(height) <= 0) {
      toast.warning("Please enter a valid height.");
      return;
    }

    if (!weight || Number(weight) <= 0) {
      toast.warning("Please enter a valid weight.");
      return;
    }

    const memberPayload = {
      name: memberName,
      age,
      phone,
      membership,
      height: Number(height),
      weight: Number(weight),
      createLogin,
      email,
      password,
    };

    if (createLogin) {
      if (email.trim() === "") {
        toast.warning("Email is required");
        return;
      }
      if (password.trim().length < 6) {
        toast.warning("Password must be at least 6 characters");
        return;
      }
    }

    try {
      if (editingId === null) {
        await addMember(memberPayload);
      } else {
        await updateMember(editingId, memberPayload);
      }
      await loadMembers();
      resetForm();
      setShowForm(false);
      toast.success("Member saved successfully.");
    } catch (error) {
      toast.error(error.response?.data || "Unable to save member.");
    }
  }

  async function deleteMemberHandler(id) {
    if (!window.confirm("Delete this member?")) {
      return;
    }

    try {
      await deleteMemberApi(id);
      await loadMembers();
      toast.success("Member deleted.");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  function editMember(member) {
    setMemberName(member.name);
    setAge(member.age);
    setPhone(member.phone);
    setHeight(member.height ?? "");
    setWeight(member.weight ?? "");
    setMembership(member.membership);
    setEditingId(member.id);
    setShowForm(true);
  }

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.membership.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = members.length;
  const membershipCounts = members.reduce(
    (acc, member) => {
      if (member.membership === "Silver") acc.Silver += 1;
      else if (member.membership === "Platinum") acc.Platinum += 1;
      else acc.Gold += 1;
      return acc;
    },
    { Gold: 0, Silver: 0, Platinum: 0 }
  );

  return (
    <Layout>
      <div className="members-page container-fluid">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
          <div>
            <h2 className="page-title">Members Management</h2>
            <p className="page-subtitle text-muted">
              Keep member profiles organized and scan QR codes for attendance.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Member
          </button>
        </div>

        <div className="member-stats mb-4">
          <div className="stat-card">
            <div className="stat-title">Total Members</div>
            <div className="stat-value">{totalMembers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Gold Members</div>
            <div className="stat-value">{membershipCounts.Gold}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Silver Members</div>
            <div className="stat-value">{membershipCounts.Silver}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Platinum Members</div>
            <div className="stat-value">{membershipCounts.Platinum}</div>
          </div>
        </div>

        {showForm && (
          <div className="card member-form-card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{editingId === null ? "Add Member" : "Edit Member"}</h4>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => { resetForm(); setShowForm(false); }}>
                  Close
                </button>
              </div>

              <div className="member-form-grid">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <select
                  className="form-select"
                  value={membership}
                  onChange={(e) => setMembership(e.target.value)}
                >
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Platinum</option>
                </select>
              </div>

              {editingId === null && (
                <>
                  <div className="form-check my-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="createLogin"
                      checked={createLogin}
                      onChange={(e) => setCreateLogin(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="createLogin">
                      Create Login Account
                    </label>
                  </div>

                  {createLogin && (
                    <div className="member-form-grid">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Initial Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="mt-4 d-flex flex-wrap gap-2">
                <button className="btn btn-success" onClick={saveMember}>
                  {editingId === null ? "Save Member" : "Update Member"}
                </button>
                <button className="btn btn-secondary" onClick={() => { resetForm(); setShowForm(false); }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card member-table-card shadow-sm">
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-3">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search by name, phone, or membership"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="text-muted mt-2 mt-md-0">
                Showing {filteredMembers.length} of {totalMembers} members
              </div>
            </div>

            <div className="table-responsive members-table">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Membership</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No members found
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.age}</td>
                        <td>{member.phone}</td>
                        <td>{member.height ?? "-"}</td>
                        <td>{member.weight ?? "-"}</td>
                        <td>
                          <span className={`badge ${
                            member.membership === "Gold"
                              ? "badge-gold"
                              : member.membership === "Silver"
                              ? "badge-silver"
                              : "badge-platinum"
                          }`}>
                            {member.membership}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="action-buttons justify-content-end">
                                <button
                             className="btn btn-outline-primary btn-sm"
                            onClick={() => setViewingMember(member)}
                                    >
                                                 View
                                    </button>
                            
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => editMember(member)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteMemberHandler(member.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {viewingMember && (
  <div className="member-modal-overlay">

    <div className="member-modal">

      {/* Header */}
      <div className="member-modal-header">

        <div>
          <h4>Member Details</h4>
          <p>Complete member profile</p>
        </div>

        <button
          className="member-modal-close"
          onClick={() => setViewingMember(null)}
        >
          ×
        </button>

      </div>

      {/* Body */}
      <div className="member-modal-body">

        <div className="member-profile-name">
          <div className="member-avatar">
            {viewingMember.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{viewingMember.name}</h3>

            <span
              className={`badge ${
                viewingMember.membership === "Gold"
                  ? "badge-gold"
                  : viewingMember.membership === "Silver"
                  ? "badge-silver"
                  : "badge-platinum"
              }`}
            >
              {viewingMember.membership}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="member-details-grid">

          <div className="member-detail-item">
            <span>Name</span>
            <strong>{viewingMember.name}</strong>
          </div>

          <div className="member-detail-item">
            <span>Age</span>
            <strong>{viewingMember.age} years</strong>
          </div>

          <div className="member-detail-item">
            <span>Phone</span>
            <strong>{viewingMember.phone}</strong>
          </div>

          <div className="member-detail-item">
            <span>Membership</span>
            <strong>{viewingMember.membership}</strong>
          </div>

          <div className="member-detail-item">
            <span>Height</span>
            <strong>
              {viewingMember.height ?? "-"} cm
            </strong>
          </div>

          <div className="member-detail-item">
            <span>Weight</span>
            <strong>
              {viewingMember.weight ?? "-"} kg
            </strong>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="member-modal-footer">

        <button
          className="btn btn-secondary"
          onClick={() => setViewingMember(null)}
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

export default Members;
