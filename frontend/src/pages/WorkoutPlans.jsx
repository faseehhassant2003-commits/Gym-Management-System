import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function WorkoutPlans() {
  const [memberName, setMemberName] = useState("");
const [workoutName, setWorkoutName] = useState("");
const [trainerName, setTrainerName] = useState("");
const [duration, setDuration] = useState("");
const [showForm,setShowForm]=useState(false);
const [editingWorkout, setEditingWorkout] = useState(null);
const [workOutPlans,setWorkoutPlans]=useState([
{ 
              memberName:"Fuad",
              workoutName:"Chest",
              trainerName:"Faseeh",
              duration:"2 hour",
            
},

])

function editWorkoutPlan(workOutPlan) {

  setMemberName(workOutPlan.memberName);
  setWorkoutName(workOutPlan.workoutName);
  setTrainerName(workOutPlan.trainerName);
  setDuration(workOutPlan.duration);

  setEditingWorkout(
    workOutPlan.memberName + workOutPlan.workoutName
  );

  setShowForm(true);
}

function deleteWorkoutPlan(memberName) {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this workout plan?"
  );

  if (!confirmDelete) {
    return;
  }

  const updatedWorkoutPlans = workOutPlans.filter(
    (workOutPlan) => workOutPlan.memberName !== memberName
  );

  setWorkoutPlans(updatedWorkoutPlans);
}
function cancelWorkoutPlan() {
  setMemberName("");
  setWorkoutName("");
  setTrainerName("");
  setDuration("");

  setEditingWorkout(null);
  setShowForm(false);
}

function saveWorkoutPlan(){
  if(memberName===""){
alert("Fill all the box");
return;
  }
   if(workoutName===""){
alert("Fill all the box");
return;
  }
   if(trainerName===""){
alert("Fill all the box");
return;
  }
   if(duration===""){
alert("Fill all the box");
return;
  }
const newWorkoutPlan={
memberName,
workoutName,
trainerName,
duration,
};
if (editingWorkout === null) {
    setWorkoutPlans([...workOutPlans, newWorkoutPlan]);
} else {
    const updatedWorkoutPlans = workOutPlans.map((workOutPlan) => {

        if (
            workOutPlan.memberName + workOutPlan.workoutName === editingWorkout
        ) {
            return newWorkoutPlan;
        }

        return workOutPlan;
    });

    setWorkoutPlans(updatedWorkoutPlans);
    setEditingWorkout(null);
}

setMemberName("");
setTrainerName("");
setDuration("");
setWorkoutName("");
setShowForm(false);


}
  return (
    <div className="container-fluid">

      <Navbar />

      <div className="row">

        <div className="col-3">
          <Sidebar />
        </div>

        <div className="col-9 mt-3">

          <h2>Workout Plan Management</h2>

          <button className="btn btn-primary mb-3" onClick={()=>setShowForm(true)}>
            + Add Workout Plan
          


</button>
          {showForm&&(
              <div className="card p-3 mb-3">
                <h4>Add workout Plan</h4>
                        <input type="text"
                        className="form-control mb-3"
                        placeholder="Member Name"
                        value={memberName}
                        onChange={(e)=>setMemberName(e.target.value)} 
                        />
                        <input type="text"
                        className="form-control mb-3"
                        placeholder="Workout name"
                        value={workoutName}
                        onChange={(e)=>setWorkoutName(e.target.value)} 
                        />
                        <input type="text"
                        className="form-control mb-3" 
                        placeholder="Trainer Name"
                        value={trainerName}
                        onChange={(e)=>setTrainerName(e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-control mb-3"
                          placeholder="Duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                      />
                       <button className="btn btn-primary mb-3" onClick={saveWorkoutPlan}>{editingWorkout === null ? "Save Workout Plan"  : "Update Workout Plan"}</button>
                       <button className="btn btn-secondary ms-2" onClick={cancelWorkoutPlan}>Cancel</button>
                       




              </div>
          )}


         <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Workout Name</th>
                <th>Trainer Name</th>
                <th>Duration</th>
               <th>Actions</th>
              </tr>

            </thead>
            <tbody>
              {workOutPlans.map((workOutPlan)=>(
              <tr key={workOutPlan.memberName+workOutPlan.trainerName}>

                <td>{workOutPlan.memberName}</td>
                <td>{workOutPlan.workoutName}</td>
                <td>{workOutPlan.trainerName}</td>
                <td>{workOutPlan.duration}</td>
                <td>
                  <button
                          className="btn btn-primary mb-3"
                          onClick={()=>editWorkoutPlan(workOutPlan)}
                        >
                          Edit
                        </button>

                      <button className="btn btn-danger btn-sm" onClick={()=>deleteWorkoutPlan(workOutPlan.memberName)}>
                        Delete
                      </button>
                </td>

</tr>
))}
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}

export default WorkoutPlans;