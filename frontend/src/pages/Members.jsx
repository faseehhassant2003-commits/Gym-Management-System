import Layout from "../layouts/Layout";
import { useState,useEffect } from "react";
import { getMembers,addMember,updateMember,deleteMember as deleteMemberApi} from "../api/memberApi";


function Members() {
  const [showForm,setShowForm]=useState(false);
  const [memberName, setMemberName] = useState("");
const [age, setAge] = useState("");
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

        console.log(response.data);   // <-- Add this line

        setMembers(response.data);
    } catch (error) {

    alert(error.response.data);

}
};
async function saveMember(){
if(memberName===""){
  alert("please enter the name");
  return;
}
if(age===""){
  alert("please enter the age");
  return;
}
if(phone===""){
  alert("please enter the phone");
  return;
}


  const newMember={
    name:memberName,
    age:age,
    phone:phone,
    membership:membership,
  };
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
        alert(error.response.data);
    } else {
        alert("Something went wrong.");
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
}
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

    <button
      className="btn btn-success"
      onClick={saveMember}
    >
      {editingId===null?"Save Member":"Update Member"}
    </button>
    <button
    className="btn btn-secondary ms-2"
    onClick={cancelEdit}
>
    Cancel
</button>

  </div>
)}

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

                {members.map((member)=>(
                      <tr key={member.id}>
                          <td>{member.name}</td>
                          <td>{member.age}</td>
                          <td>{member.phone}</td>
                          <td>{member.membership}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2 " onClick={()=>editMember(member)}>Edit</button>
                         
                            <button className="btn btn-warning btn-sm me-2" onClick={()=>deleteMemberHandler(member.id)}>Delete</button>
                          </td>



                      </tr>))}

            </tbody>

          </table>

      </Layout>
  );
}

export default Members;