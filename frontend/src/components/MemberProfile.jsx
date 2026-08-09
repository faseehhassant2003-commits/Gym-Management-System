import { useEffect, useState } from "react";
import { getMemberProfile } from "../api/memberApi";
import "./Sidebar.css";

function MemberProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getMemberProfile()
      .then((res) => {
        if (mounted) setProfile(res.data);
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.data || "Failed to load profile");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="member-profile">Loading...</div>;
  if (error) return <div className="member-profile">Error loading profile</div>;
  if (!profile) return null;

  return (
    <div className="member-profile mb-3 text-white">
      <div className="member-name">{profile.name}</div>
      <div className="member-username">@{profile.username}</div>
      <div className="member-info">
        <div>{profile.email}</div>
        <div>{profile.phone}</div>
        <div>Membership: {profile.membership}</div>
      </div>
    </div>
  );
}

export default MemberProfile;
