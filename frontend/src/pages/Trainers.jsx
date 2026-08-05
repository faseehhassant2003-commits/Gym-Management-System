import Layout from "../layouts/Layout";
import { useState,useEffect } from "react";
import{
  getTrainers,
  addTrainer,
  updateTrainer,
  deleteTrainer
}from "../api/TrainerApi";
function Trainers() {
    const [showForm, setShowForm] = useState(false);

const [trainerName, setTrainerName] = useState("");
const [age, setAge] = useState("");
const [specialization, setSpecialization] = useState("");
const [phone, setPhone] = useState("");
const [salary, setSalary] = useState("");

const [editingId, setEditingId] = useState(null);
const [trainers,setTrainers]=useState([])

useEffect(() => {
    loadTrainers();
}, []);

async function loadTrainers() {
    const response = await getTrainers();
    setTrainers(response.data);
}
  

  async function handleDeleteTrainer(id) {
    if (window.confirm("Are you sure you want to delete this trainer?")) {
        await deleteTrainer(id);
        await loadTrainers();
    }
}

function editTrainer(trainer){
    setTrainerName(trainer.name);
    setSpecialization(trainer.specialization);
    setPhone(trainer.phone);
    setSalary(trainer.salary);
    setAge(trainer.age);
    setEditingId(trainer.id);
    setShowForm(true);
}


function canceelButt(){
setTrainerName("");
setSpecialization("");
setPhone("");
setSalary("");
setAge("");
setEditingId(null);
setShowForm(false);

}
async function saveTrainer() {

  if (trainerName === "") {
    alert("Please enter trainer name");
    return;
  }

  if (specialization === "") {
    alert("Please enter specialization");
    return;
  }

  if (phone === "") {
    alert("Please enter phone");
    return;
  }

  if (salary === "") {
    alert("Please enter salary");
    return;
  }

  if (age === "") {
    alert("Please enter age");
    return;
  }

  const newTrainer = {
    name: trainerName,
     age:age,
    specialization: specialization,
    phone: phone,
    salary: salary,
   
  };

if(editingId===null){  
   await addTrainer(newTrainer);
   await loadTrainers();
  }else{
    await updateTrainer(editingId, newTrainer);
    await loadTrainers();
    setEditingId(null);}

  setTrainerName("");
  setSpecialization("");
  setPhone("");
  setSalary("");
  setAge("");
  setShowForm(false);
}

  return (
     <Layout>

          <h2>Trainer Management</h2>
                <button className="btn btn-primary mb-3" onClick={()=>setShowForm(true)}>+ Add Trainer</button>
                {
                    showForm&&(
                      <div className="card p-3 mb-3">
                        <h4>Add Trainer</h4>

                                          <input type="text"
                        className="form-control mb-3"
                        placeholder="Trainer Name"
                        value={trainerName}
                        onChange={(e)=>setTrainerName(e.target.value)}
                         />
                        <input type="text"
                        className="form-control mb-3"
                        placeholder="Specialization"
                        value={specialization}
                        onChange={(e)=>setSpecialization(e.target.value)}
                         />


                         <input type="text"
                        className="form-control mb-3"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e)=>setPhone(e.target.value)}
                         />
                         
                         <input type="number"
                        className="form-control mb-3"
                        placeholder="Salary"
                        value={salary}
                        onChange={(e)=>setSalary(e.target.value)}
                         />

       

                         <input type="number"
                        className="form-control mb-3"
                        placeholder="age"
                        value={age}
                        onChange={(e)=>setAge(e.target.value)}
                         />
                         <button className="btn btn-success me-2" onClick={(saveTrainer)}>
                         {editingId===null? "Save Trainer":"Update Trainer"}
                         </button>
                         <button className="btn btn-secondary" onClick={(canceelButt)}>
                         Cancel
                         </button>

                      </div>
                    )

                }
        <table className="table table-bordered table-striped">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Phone</th>
                      <th>Salary</th>
                      <th>Age</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                {trainers.map((trainer)=>(
                    <tr key={trainer.id}>
                      <td>{trainer.name}</td>
                        <td>{trainer.specialization}</td>
                        <td>{trainer.phone}</td>
                        <td>{trainer.salary}</td>
                        <td>{trainer.age}</td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={()=>editTrainer(trainer)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={()=>handleDeleteTrainer(trainer.id)}>
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

export default Trainers;
// next is trainer