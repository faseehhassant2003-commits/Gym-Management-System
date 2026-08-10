import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { getMemberProfile, updateMemberProfile } from "../api/memberApi";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    let mounted = true;
    getMemberProfile()
      .then((res) => {
        if (mounted) {
          setProfile(res.data);
          setForm({
            name: res.data.name || "",
            age: res.data.age ?? "",
            phone: res.data.phone || "",
            height: res.data.height ?? "",
            weight: res.data.weight ?? "",
          });
        }
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.data || "Failed to load profile");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  if (loading) return <div className="profile-page container mt-5">Loading...</div>;
  if (error) return <div className="profile-page container mt-5">Error loading profile</div>;
  if (!profile) return null;

  const profileData = profile.member ?? profile;
  const tokenValue =
    profile.token ||
    profile.member?.token ||
    profileData.token ||
    profileData.qrToken ||
    profileData.qr_code;

  const initials = profileData.name
    ? profileData.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "M";

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function saveProfile() {
    // basic validation
    if (!form.name || form.name.trim().length < 3) {
      toast.warning("Name must be at least 3 characters");
      return;
    }
    if (!/^\d{10}$/.test(String(form.phone))) {
      toast.warning("Phone must be 10 digits");
      return;
    }
    const payload = {
      name: form.name,
      age: parseInt(form.age || 0, 10),
      phone: form.phone,
      height: parseFloat(form.height || 0),
      weight: parseFloat(form.weight || 0),
    };

    try {
      const res = await updateMemberProfile(payload);
      setProfile(res.data);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data || "Failed to update profile");
    }
  }

  return (
    <div className="profile-page container mt-5">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-title">
            <h2>{profileData.name}</h2>
            <div className="profile-username">@{profileData.username}</div>
          </div>
        </div>

        <div className="profile-qr-section mb-4">
          <div className="qr-section-header">
            <div>
              <h5>Member QR Code</h5>
              <p className="qr-description">
                {tokenValue
                  ? "Scan this code for member validation or token transfer."
                  : "No QR token is available for this profile yet. Contact admin if it should be generated."}
              </p>
            </div>
          </div>
          <div className="qr-code-wrapper">
            {tokenValue ? (
              <QRCodeCanvas value={tokenValue} size={200} bgColor="#ffffff" fgColor="#1a1a1a" />
            ) : (
              <div className="qr-placeholder">Token unavailable</div>
            )}
          </div>
        </div>

        <div className="profile-body">
          {editing ? (
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" name="name" value={form.name} onChange={onChange} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={onChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Age</label>
                <input type="number" className="form-control" name="age" value={form.age} onChange={onChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Height (cm)</label>
                <input type="number" step="0.1" className="form-control" name="height" value={form.height} onChange={onChange} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Weight (kg)</label>
                <input type="number" step="0.1" className="form-control" name="weight" value={form.weight} onChange={onChange} />
              </div>
            </div>
          ) : (
            <div className="profile-grid">
              <div className="profile-item">
                <div className="label">Email</div>
                <div className="value">{profile.email}</div>
              </div>
              <div className="profile-item">
                <div className="label">Phone</div>
                <div className="value">{profile.phone}</div>
              </div>
              <div className="profile-item">
                <div className="label">Age</div>
                <div className="value">{profile.age}</div>
              </div>
              <div className="profile-item">
                <div className="label">Height</div>
                <div className="value">{profile.height ?? "-"}</div>
              </div>
              <div className="profile-item">
                <div className="label">Weight</div>
                <div className="value">{profile.weight ?? "-"}</div>
              </div>
              <div className="profile-item">
                <div className="label">Membership</div>
                <div className="value">{profile.membership}</div>
              </div>
              <div className="profile-item">
                <div className="label">ID</div>
                <div className="value">{profile.id}</div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button className="btn btn-primary btn-sm me-2" onClick={saveProfile}>Save</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => { setEditing(false); setForm({ name: profile.name || "", age: profile.age ?? "", phone: profile.phone || "", height: profile.height ?? "", weight: profile.weight ?? "" }); }}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
