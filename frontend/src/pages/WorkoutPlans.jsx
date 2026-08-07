import { useState } from "react";
import Layout from "../layouts/Layout";
import { generateWorkout } from "../api/WorkoutApi";
import ReactMarkdown from "react-markdown";

function WorkoutPlans() {
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("Male");
    const [goal, setGoal] = useState("Muscle Gain");
    const [experience, setExperience] = useState("Beginner");
    const [workoutDays, setWorkoutDays] = useState(5);
    const [equipment, setEquipment] = useState("Gym");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    async function handleGenerateWorkout() {

        if (!age || !height || !weight) {
            alert("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {

            const response = await generateWorkout({
                age: Number(age),
                gender,
                height: Number(height),
                weight: Number(weight),
                goal,
                experience,
                workoutDays: Number(workoutDays),
                equipment
            });

            setResult(response.data);

        } catch (error) {

            console.error(error);
            alert("Failed to generate workout plan.");

        } finally {

            setLoading(false);

        }
    }

    return (
        <Layout>

            <h2 className="mb-4">🤖 AI Workout Generator</h2>

            <div className="card p-4 shadow-sm">

                <div className="row">

                    <div className="col-md-3 mb-3">
                        <input
                            className="form-control"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <input
                            className="form-control"
                            placeholder="Height (cm)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <input
                            className="form-control"
                            placeholder="Weight (kg)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-3 mb-3">
                        <select
                            className="form-select"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        >
                            <option>Muscle Gain</option>
                            <option>Weight Loss</option>
                            <option>Maintenance</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-3">
                        <select
                            className="form-select"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Workout Days"
                            value={workoutDays}
                            onChange={(e) => setWorkoutDays(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3 mb-3">
                        <select
                            className="form-select"
                            value={equipment}
                            onChange={(e) => setEquipment(e.target.value)}
                        >
                            <option>Gym</option>
                            <option>Home</option>
                        </select>
                    </div>

                </div>

                <button
                    className="btn btn-success"
                    onClick={handleGenerateWorkout}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate AI Workout"}
                </button>

            </div>

            {result && (

                <div className="card mt-4 shadow-sm">

                    <div className="card-header bg-success text-white">
                        <h4 className="mb-0">
                            🏋 AI Workout Plan
                        </h4>
                    </div>

                    <div className="card-body">
                        <ReactMarkdown>
                            {result}
                        </ReactMarkdown>
                    </div>

                </div>

            )}

        </Layout>
    );
}

export default WorkoutPlans;