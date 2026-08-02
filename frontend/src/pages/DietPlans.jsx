import Layout from "../layouts/Layout";
import { useEffect,useState } from "react";
import {getMembers} from "../api/memberApi";
import { generateDiet } from "../api/DietApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function DietPlans() {

  const [showForm, setShowForm] = useState(false);

  const [selectedMember, setSelectedMember] = useState("");

  const [age, setAge] = useState("");

  const [height, setHeight] = useState("");

  const [weight, setWeight] = useState("");

  const [gender, setGender] = useState("");

  const [goal, setGoal] = useState("");

  const [activityLevel, setActivityLevel] = useState("");

  const [dietPreference, setDietPreference] = useState("");

  const [generatedDiet, setGeneratedDiet] = useState(null);

  const [members, setMembers] = useState([]);

  useEffect(()=>{
    loadMembers();
  },[]);

async function loadMembers() {
  const response =await getMembers();
  console.log(response.data);
  setMembers(response.data);
}

async function generateDietPlan() {
 

    const dietRequest = {
        memberId: selectedMember,
        age: age,
        height: height,
        weight: weight,
        gender: gender,
        goal: goal,
        activityLevel: activityLevel,
        dietPreference: dietPreference
    };

const response=await generateDiet(dietRequest);
console.log(response.data);
setGeneratedDiet(response.data);

}

  return (<Layout>

          <h2>AI Diet Plan Generator</h2>

          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowForm(true)}
          >
            + Generate Diet Plan
          </button>

          {showForm && (

            <div className="card p-3">

              <h4>Generate AI Diet Plan</h4>

        



                <div className="mb-3">

    <label className="form-label">
        Member
    </label>

    <select
        className="form-control"
        value={selectedMember}
        onChange={(e) => setSelectedMember(e.target.value)}
    >

        <option value="">
            Select Member
        </option>

        {members.map((member) => (

            <option
                key={member.id}
                value={member.id}
            >
                {member.name}
            </option>

        ))}

    </select>

</div>




              <div className="mb-3">

    <label className="form-label">
        Age
    </label>

    <input
        type="number"
        className="form-control"
        placeholder="Enter Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
    />

</div>

         <div className="mb-3">

    <label className="form-label">
        Height (cm)
    </label>

    <input
        type="number"
        className="form-control"
        placeholder="Enter Height in cm"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
    />

</div>

             <div className="mb-3">

    <label className="form-label">
        Weight (kg)
    </label>

    <input
        type="number"
        className="form-control"
        placeholder="Enter Weight in kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
    />

</div>

            <div className="mb-3">

    <label className="form-label">
        Gender
    </label>

    <select
        className="form-control"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
    >

        <option value="">
            Select Gender
        </option>

        <option value="Male">
            Male
        </option>

        <option value="Female">
            Female
        </option>

    </select>

</div>

             <div className="mb-3">

    <label className="form-label">
        Goal
    </label>

    <select
        className="form-control"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
    >

        <option value="">
            Select Goal
        </option>

        <option value="Muscle Gain">
            Muscle Gain
        </option>

        <option value="Weight Loss">
            Weight Loss
        </option>

        <option value="Maintenance">
            Maintenance
        </option>

    </select>

</div>

             <div className="mb-3">

    <label className="form-label">
        Activity Level
    </label>

    <select
        className="form-control"
        value={activityLevel}
        onChange={(e) => setActivityLevel(e.target.value)}
    >

        <option value="">
            Select Activity Level
        </option>

        <option value="Sedentary">
            Sedentary
        </option>

        <option value="Lightly Active">
            Lightly Active
        </option>

        <option value="Moderately Active">
            Moderately Active
        </option>

        <option value="Very Active">
            Very Active
        </option>

    </select>

</div>

              <div className="mb-3">

    <label className="form-label">
        Diet Preference
    </label>

    <select
        className="form-control"
        value={dietPreference}
        onChange={(e) => setDietPreference(e.target.value)}
    >

        <option value="">
            Select Diet Preference
        </option>

        <option value="Vegetarian">
            Vegetarian
        </option>

        <option value="Non Vegetarian">
            Non Vegetarian
        </option>

        <option value="Vegan">
            Vegan
        </option>

    </select>

</div>

<div className="d-grid">

    <button
        className="btn btn-success"
        onClick={generateDietPlan}
    >
        Generate AI Diet Plan
    </button>

</div>
            </div>

          )}

          {generatedDiet && (

            <div className="card mt-4 p-3">

              <h4>Generated Diet Plan</h4>

 <div className="ai-diet">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {generatedDiet}
    </ReactMarkdown>
</div>
            </div>

          )}

       </Layout>
  );
}

export default DietPlans;