import { useState,useEffect } from "react";
import Layout from "../layouts/Layout";
import { generateWorkout,getMyWorkout } from "../api/WorkoutApi";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

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

    const [workout, setWorkout] = useState(null);

    useEffect(() => {
    loadMyWorkout();
}, []);

async function loadMyWorkout() {
    try {

        const response = await getMyWorkout();

if (response.data) {
    setWorkout(response.data);
    setResult(response.data.workoutContent);

    setAge(response.data.age || "");
    setHeight(response.data.height || "");
    setWeight(response.data.weight || "");
    setGender(response.data.gender || "Male");
    setGoal(response.data.goal || "Muscle Gain");
    setExperience(response.data.experience || "Beginner");
    setWorkoutDays(response.data.workoutDays || 5);
    setEquipment(response.data.equipment || "Gym");
}
    } catch (error) {

        console.error(
            "Failed to load saved workout:",
            error
        );

    }
}

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

const savedWorkoutResponse = await getMyWorkout();

if (savedWorkoutResponse.data) {
    setWorkout(savedWorkoutResponse.data);
}

        } catch (error) {

            console.error(error);
            alert("Failed to generate workout plan.");

        } finally {

            setLoading(false);

        }
    }
    function downloadWorkoutPDF() {

    if (!result) {
        alert("No workout plan available.");
        return;
    }

    const doc = new jsPDF();

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.text("AI Workout Plan", margin, y);

    y += 15;

    // Workout information
    doc.setFontSize(11);

    if (workout) {

        doc.text(`Goal: ${workout.goal || "-"}`, margin, y);
        y += 7;

        doc.text(
            `Experience: ${workout.experience || "-"}`,
            margin,
            y
        );
        y += 7;

        doc.text(
            `Workout Days: ${workout.workoutDays || "-"}`,
            margin,
            y
        );
        y += 7;

        doc.text(
            `Equipment: ${workout.equipment || "-"}`,
            margin,
            y
        );

        y += 12;
    }

    // Workout content
    doc.setFontSize(10);

    const cleanText = result
        .replace(/#{1,6}\s?/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1");

    const lines = doc.splitTextToSize(
        cleanText,
        maxWidth
    );

    lines.forEach((line) => {

        if (y > 280) {
            doc.addPage();
            y = 20;
        }

        doc.text(line, margin, y);
        y += 6;
    });

    doc.save("my-ai-workout-plan.pdf");
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
                  <>
        <div className="d-flex justify-content-end mt-4">

            <button
                className="btn btn-outline-primary"
                onClick={downloadWorkoutPDF}
            >
                <i className="bi bi-download me-2"></i>
                Download Workout PDF
            </button>

        </div>

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
</>
            )}

        </Layout>
    );
}

export default WorkoutPlans;