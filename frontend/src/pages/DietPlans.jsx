import { useState } from "react";
import Layout from "../layouts/Layout";
import { generateDiet } from "../api/DietApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function DietPlans() {

    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("Male");
    const [goal, setGoal] = useState("Muscle Gain");
    const [activityLevel, setActivityLevel] = useState("Moderately Active");
    const [dietPreference, setDietPreference] = useState("Non Vegetarian");

    const [loading, setLoading] = useState(false);
    const [generatedDiet, setGeneratedDiet] = useState("");

    async function generateDietPlan() {

        if (!age || !height || !weight) {
            alert("Please fill all required fields.");
            return;
        }

        setLoading(true);

        try {

            const response = await generateDiet({
                age: Number(age),
                gender,
                height: Number(height),
                weight: Number(weight),
                goal,
                activityLevel,
                dietPreference
            });

            setGeneratedDiet(response.data);

        } catch (error) {

            console.error(error);
            alert("Failed to generate diet plan.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <Layout>

            <h2 className="mb-4">🥗 AI Diet Generator</h2>

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

                    <div className="col-md-4 mb-3">

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

                    <div className="col-md-4 mb-3">

                        <select
                            className="form-select"
                            value={activityLevel}
                            onChange={(e) => setActivityLevel(e.target.value)}
                        >
                            <option>Sedentary</option>
                            <option>Lightly Active</option>
                            <option>Moderately Active</option>
                            <option>Very Active</option>
                        </select>

                    </div>

                    <div className="col-md-4 mb-3">

                        <select
                            className="form-select"
                            value={dietPreference}
                            onChange={(e) => setDietPreference(e.target.value)}
                        >
                            <option>Vegetarian</option>
                            <option>Non Vegetarian</option>
                            <option>Vegan</option>
                        </select>

                    </div>

                </div>

                <button
                    className="btn btn-success"
                    onClick={generateDietPlan}
                    disabled={loading}
                >

                    {loading
                        ? "Generating..."
                        : "Generate AI Diet"}

                </button>

            </div>

            {generatedDiet && (

                <div className="card mt-4 shadow-sm">

                    <div className="card-header bg-success text-white">

                        <h4 className="mb-0">
                            🥗 AI Diet Plan
                        </h4>

                    </div>

                    <div className="card-body">

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