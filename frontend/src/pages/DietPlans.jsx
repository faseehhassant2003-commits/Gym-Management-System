import { useState, useEffect } from "react";
import Layout from "../layouts/Layout";
import jsPDF from "jspdf";
import {
    generateDiet,
    getMyDiet
} from "../api/DietApi";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function DietPlans() {

    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("Male");

    const [goal, setGoal] = useState("Muscle Gain");

    const [activityLevel, setActivityLevel] =
        useState("Moderately Active");

    const [dietPreference, setDietPreference] =
        useState("Non Vegetarian");


    const [loading, setLoading] = useState(false);

    const [generatedDiet, setGeneratedDiet] =
        useState("");

    const [dietPlan, setDietPlan] =
        useState(null);


    // =====================================================
    // LOAD SAVED DIET WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadMyDiet();

    }, []);


    async function loadMyDiet() {

        try {

            const response =
                await getMyDiet();


            if (response.data) {

                // Save complete DietPlan object
                setDietPlan(response.data);


                // Load saved AI content
                setGeneratedDiet(
                    response.data.dietContent
                );


                // Restore saved input values
                setAge(
                    response.data.age || ""
                );

                setHeight(
                    response.data.height || ""
                );

                setWeight(
                    response.data.weight || ""
                );

                setGender(
                    response.data.gender || "Male"
                );

                setGoal(
                    response.data.goal || "Muscle Gain"
                );

                setActivityLevel(
                    response.data.activityLevel ||
                    "Moderately Active"
                );

                setDietPreference(
                    response.data.dietPreference ||
                    "Non Vegetarian"
                );
            }


        } catch (error) {

            console.error(
                "Failed to load saved diet:",
                error
            );

        }
    }


    // =====================================================
    // GENERATE AI DIET
    // =====================================================

    async function generateDietPlan() {

        if (!age || !height || !weight) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        setLoading(true);


        try {

            // =============================================
            // GENERATE DIET
            // =============================================

            const response =
                await generateDiet({

                    age: Number(age),

                    gender,

                    height: Number(height),

                    weight: Number(weight),

                    goal,

                    activityLevel,

                    dietPreference

                });


            // Display generated content
            setGeneratedDiet(
                response.data
            );


            // =============================================
            // LOAD SAVED DIET FROM DATABASE
            // =============================================

            const savedDietResponse =
                await getMyDiet();


            if (savedDietResponse.data) {

                setDietPlan(
                    savedDietResponse.data
                );

            }


        } catch (error) {

            console.error(
                "Failed to generate diet:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to generate diet plan."
            );


        } finally {

            setLoading(false);

        }
    }
function downloadDietPDF() {

    if (!generatedDiet) {
        alert("No diet plan available to download.");
        return;
    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 15;
    const maxWidth = pageWidth - margin * 2;

    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");

    doc.text(
        "Personalized AI Diet Plan",
        pageWidth / 2,
        y,
        { align: "center" }
    );

    y += 12;

    // Member details
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    if (dietPlan) {

        doc.text(`Age: ${dietPlan.age}`, margin, y);
        y += 6;

        doc.text(`Gender: ${dietPlan.gender}`, margin, y);
        y += 6;

        doc.text(`Height: ${dietPlan.height} cm`, margin, y);
        y += 6;

        doc.text(`Weight: ${dietPlan.weight} kg`, margin, y);
        y += 6;

        doc.text(`Goal: ${dietPlan.goal}`, margin, y);
        y += 6;

        doc.text(
            `Diet Preference: ${dietPlan.dietPreference}`,
            margin,
            y
        );

        y += 12;
    }

    // Separator
    doc.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 10;

    // Convert Markdown into readable plain text
    const plainText = generatedDiet
        .replace(/^#{1,6}\s*/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/^\s*[-*]\s+/gm, "• ")
        .replace(/\r/g, "");

    const lines = doc.splitTextToSize(
        plainText,
        maxWidth
    );

    doc.setFontSize(10.5);
    doc.setFont("helvetica", "normal");

    lines.forEach((line) => {

        if (y > pageHeight - 20) {

            doc.addPage();

            y = 20;
        }

        doc.text(
            line,
            margin,
            y
        );

        y += 5.5;
    });

    // Footer
    const totalPages =
        doc.internal.getNumberOfPages();

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        doc.setPage(i);

        doc.setFontSize(8);

        doc.text(
            `Gym Management System • Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
        );
    }

    doc.save("My_AI_Diet_Plan.pdf");
}

    return (

        <Layout>

            <h2 className="mb-4">
                🥗 AI Diet Generator
            </h2>


            {/* =================================================
                INPUT CARD
            ================================================= */}

            <div className="card p-4 shadow-sm">

                <div className="row">


                    {/* AGE */}

                    <div className="col-md-3 mb-3">

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Age"
                            value={age}
                            onChange={(e) =>
                                setAge(e.target.value)
                            }
                        />

                    </div>


                    {/* HEIGHT */}

                    <div className="col-md-3 mb-3">

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Height (cm)"
                            value={height}
                            onChange={(e) =>
                                setHeight(e.target.value)
                            }
                        />

                    </div>


                    {/* WEIGHT */}

                    <div className="col-md-3 mb-3">

                        <input
                            type="number"
                            className="form-control"
                            placeholder="Weight (kg)"
                            value={weight}
                            onChange={(e) =>
                                setWeight(e.target.value)
                            }
                        />

                    </div>


                    {/* GENDER */}

                    <div className="col-md-3 mb-3">

                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) =>
                                setGender(e.target.value)
                            }
                        >

                            <option>
                                Male
                            </option>

                            <option>
                                Female
                            </option>

                        </select>

                    </div>

                </div>


                <div className="row">


                    {/* GOAL */}

                    <div className="col-md-4 mb-3">

                        <select
                            className="form-select"
                            value={goal}
                            onChange={(e) =>
                                setGoal(e.target.value)
                            }
                        >

                            <option>
                                Muscle Gain
                            </option>

                            <option>
                                Weight Loss
                            </option>

                            <option>
                                Maintenance
                            </option>

                        </select>

                    </div>


                    {/* ACTIVITY LEVEL */}

                    <div className="col-md-4 mb-3">

                        <select
                            className="form-select"
                            value={activityLevel}
                            onChange={(e) =>
                                setActivityLevel(
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Sedentary
                            </option>

                            <option>
                                Lightly Active
                            </option>

                            <option>
                                Moderately Active
                            </option>

                            <option>
                                Very Active
                            </option>

                        </select>

                    </div>


                    {/* DIET PREFERENCE */}

                    <div className="col-md-4 mb-3">

                        <select
                            className="form-select"
                            value={dietPreference}
                            onChange={(e) =>
                                setDietPreference(
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Vegetarian
                            </option>

                            <option>
                                Non Vegetarian
                            </option>

                            <option>
                                Vegan
                            </option>

                        </select>

                    </div>

                </div>


                {/* GENERATE BUTTON */}

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


            {/* =================================================
                GENERATED / SAVED DIET
            ================================================= */}

            {generatedDiet && (

                <div className="card mt-4 shadow-sm">


                    <div className="card-header bg-success text-white">

                        <h4 className="mb-0">

                            🥗 AI Diet Plan

                        </h4>

                    </div>


                  <div className="card-body">

    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
    >
        {generatedDiet}
    </ReactMarkdown>

    <div className="mt-4">

        <button
            className="btn btn-primary"
            onClick={downloadDietPDF}
        >
            📄 Download Diet PDF
        </button>

    </div>

</div>

                </div>

            )}


        </Layout>

    );
}


export default DietPlans;