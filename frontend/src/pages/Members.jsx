import Layout from "../layouts/Layout";
import { useState,useEffect } from "react";

import { getMembers,addMember,updateMember,deleteMember as deleteMemberApi} from "../api/memberApi";
import { toast } from "react-toastify";


function Members() {
    const [createLogin, setCreateLogin] = useState(false);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
  const [showForm,setShowForm]=useState(false);
  const [memberName, setMemberName] = useState("");
const [age, setAge] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [phone, setPhone] = useState("");
const [membership, setMembership] = useState("Gold");
const [editingId, setEditingId] = useState(null);
const [members,setMembers]=useState([]);
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
async function saveMember(){
if(memberName.trim().length < 3){

    toast.warning("Name must contain at least 3 characters");

    return;
}
if(age < 16 || age > 100){

    toast.warning("Age must be between 16 and 100");

    return;
}
if(!/^\d{10}$/.test(phone)){

    toast.warning("Phone number must contain exactly 10 digits");

    return;
}


  const newMember={
    name:memberName,
    age:age,
    phone:phone,
    membership:membership,
     createLogin: createLogin,
    username: username,
    password: password
  };
  if (createLogin) {

    if (username.trim() === "") {
        toast.warning("Username is required");
        return;
    }

    if (password.trim().length < 6) {
        toast.warning("Password must be at least 6 characters");
        return;
    }

}
try {
    if (editingId === null) {
        await addMember(newMember);
    } else {
        await updateMember(editingId, newMember);
        setEditingId(null);
    }

    await loadMembers();

    setMemberName("");
    setAge("");
    setPhone("");
    setMembership("Gold");
    setShowForm(false);
setCreateLogin(false);
setUsername("");
setPassword("");

} catch (error) {
    console.error(error);
}
}
async function deleteMemberHandler(id) {

    if (window.confirm("Delete this member?")) {

        try {
            await deleteMemberApi(id);

            await loadMembers();

        } catch (error) {

    if (error.response) {
        toast.error(error.response.data);
    } else {
        toast.error("Something went wrong.");
    }

}

    }
}
function editMember(member){
    setMemberName(member.name);
    setAge(member.age);
    setPhone(member.phone);
    setMembership(member.membership);

    setEditingId(member.id);

    setShowForm(true);
}
function cancelEdit() {
    setMemberName("");
    setAge("");
    setPhone("");
    setMembership("Gold");
    setEditingId(null);
    setShowForm(false);
    setCreateLogin(false);
setUsername("");
setPassword("");
}
const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||member.phone.includes(searchTerm) || member.membership.toLowerCase().includes(searchTerm.toLowerCase())
);
return (


<Layout>

          <h2>Members Management</h2>

          <button className="btn btn-primary mb-3"
          onClick={()=>setShowForm(true)}>
            + Add Member
          </button>
        {showForm && (
  <div className="card p-3 mb-3">

    <h4>Add Member</h4>

    <input
      type="text"
      className="form-control mb-3"
      placeholder="Enter Name"
      value={memberName}
      onChange={(e) => setMemberName(e.target.value)}
    />

    <input
      type="number"
      className="form-control mb-3"
      placeholder="Enter Age"
      value={age}
      onChange={(e) => setAge(e.target.value)}
    />

    <input
      type="text"
      className="form-control mb-3"
      placeholder="Enter Phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />



 <select
    className="form-select mb-3"
    value={membership}
    onChange={(e) => setMembership(e.target.value)}
>
    <option>Gold</option>
    <option>Silver</option>
    <option>Platinum</option>
</select>

{editingId === null && (

    <>
        <div className="form-check mb-3">

            <input
                className="form-check-input"
                type="checkbox"
                id="createLogin"
                checked={createLogin}
                onChange={(e) => setCreateLogin(e.target.checked)}
            />

            <label
                className="form-check-label"
                htmlFor="createLogin"
            >
                Create Login Account
            </label>

        </div>

        {createLogin && (

            <>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Initial Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </>

        )}

    </>

)}

<div className="mt-3">

    <button
        className="btn btn-success"
        onClick={saveMember}
    >
        {editingId === null ? "Save Member" : "Update Member"}
    </button>

    <button
        className="btn btn-secondary ms-2"
        onClick={cancelEdit}
    >
        Cancel
    </button>

</div>

  </div>
)}
<input
    type="text"
    className="form-control mb-3"
    placeholder="Search by name,phone or membership"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
/>
          <table className="table table-bordered table-striped">

            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Membership</th>
                <th >Actions</th>
              </tr>
            </thead>

            <tbody>

{filteredMembers.length === 0 ? (

    <tr>
        <td colSpan="5" className="text-center">
            No members found
        </td>
    </tr>

) : (

    filteredMembers.map((member) => (

        <tr key={member.id}>
            <td>{member.name}</td>
            <td>{member.age}</td>
            <td>{member.phone}</td>
            <td>{member.membership}</td>
            <td>
                <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editMember(member)}
                >
                    Edit
                </button>

                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMemberHandler(member.id)}
                >
                    Delete
                </button>
            </td>
        </tr>

    ))

)}

</tbody>

          </table>

      </Layout>
  );
}

export default Members; 