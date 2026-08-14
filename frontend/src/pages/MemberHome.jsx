import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMemberProfile } from "../api/memberApi";
import { getMyWorkout } from "../api/WorkoutApi";
import { getMyDiet } from "../api/DietApi";
import { getActiveSubscription } from "../api/MemberSubscriptionApi";

import "./MemberHome.css";


function MemberHome() {

    // =====================================================
    // STATE
    // =====================================================

    const [profile, setProfile] = useState(null);

    const [workout, setWorkout] = useState(null);

    const [diet, setDiet] = useState(null);

    const [subscription, setSubscription] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD MEMBER HOME DATA
    // =====================================================

    useEffect(() => {

        loadMemberHome();

    }, []);


    async function loadMemberHome() {

        try {

            setLoading(true);


            // =================================================
            // MEMBER PROFILE
            // =================================================

            try {

                const profileResponse =
                    await getMemberProfile();

                setProfile(
                    profileResponse.data
                );

            } catch (error) {

                console.error(
                    "Failed to load member profile:",
                    error
                );

            }


            // =================================================
            // SAVED AI WORKOUT
            // =================================================

            try {

                const workoutResponse =
                    await getMyWorkout();

                if (workoutResponse.data) {

                    setWorkout(
                        workoutResponse.data
                    );

                } else {

                    setWorkout(null);

                }

            } catch (error) {

                console.error(
                    "Failed to load workout:",
                    error
                );

                setWorkout(null);

            }


            // =================================================
            // SAVED AI DIET
            // =================================================

            try {

                const dietResponse =
                    await getMyDiet();

                if (dietResponse.data) {

                    setDiet(
                        dietResponse.data
                    );

                } else {

                    setDiet(null);

                }

            } catch (error) {

                console.error(
                    "Failed to load diet:",
                    error
                );

                setDiet(null);

            }


            // =================================================
            // ACTIVE SUBSCRIPTION
            // =================================================

            try {

                const profileResponse =
                    await getMemberProfile();

                const member =
                    profileResponse.data;


                if (member?.id) {

                    try {

                        const subscriptionResponse =
                            await getActiveSubscription(
                                member.id
                            );

                        setSubscription(
                            subscriptionResponse.data
                        );

                    } catch (error) {

                        // Member doesn't have active subscription
                        setSubscription(null);

                    }

                }

            } catch (error) {

                console.error(
                    "Failed to load subscription:",
                    error
                );

                setSubscription(null);

            }

        } finally {

            setLoading(false);

        }

    }


    // =====================================================
    // DAYS REMAINING
    // =====================================================

    function getDaysRemaining() {

        if (!subscription?.expiryDate) {

            return "-";

        }


        const expiry =
            new Date(
                subscription.expiryDate
            );

        const today =
            new Date();


        expiry.setHours(
            0,
            0,
            0,
            0
        );

        today.setHours(
            0,
            0,
            0,
            0
        );


        const difference =
            expiry - today;


        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        return Math.max(
            days,
            0
        );

    }


    // =====================================================
    // MEMBERSHIP PROGRESS
    // =====================================================

    function getMembershipProgress() {

        if (
            !subscription?.startDate ||
            !subscription?.expiryDate
        ) {

            return 0;

        }


        const start =
            new Date(
                subscription.startDate
            );

        const expiry =
            new Date(
                subscription.expiryDate
            );

        const today =
            new Date();


        const total =
            expiry - start;

        const elapsed =
            today - start;


        if (total <= 0) {

            return 0;

        }


        const progress =
            (elapsed / total) * 100;


        return Math.min(
            Math.max(
                Math.round(progress),
                0
            ),
            100
        );

    }


    // =====================================================
    // DATE FORMAT
    // =====================================================

    function formatDate(date) {

        if (!date) {

            return "-";

        }


        const d =
            new Date(date);


        if (isNaN(d.getTime())) {

            return date;

        }


        return d.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

           

                <div className="member-home">

                    <div className="member-card">

                        <p>
                            Loading your dashboard...
                        </p>

                    </div>

                </div>

         

        );

    }


    const daysRemaining =
        getDaysRemaining();


    const membershipProgress =
        getMembershipProgress();


    // =====================================================
    // PAGE
    // =====================================================

    return (

        

            <div className="member-home">


                {/* =================================================
                    WELCOME SECTION
                ================================================= */}

                <div className="member-welcome">

                    <div>

                        <p className="member-welcome-small">
                            WELCOME BACK 👋
                        </p>

                        <h1>
                            Hello,{" "}
                            {profile?.name || "Member"}!
                        </h1>

                        <p className="member-quote">
                            "Consistency is the key to transformation."
                        </p>

                    </div>


                    <div className="welcome-icon">
                        🏋️
                    </div>

                </div>



                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="member-summary-grid">


                    {/* =================================================
                        WORKOUT
                    ================================================= */}

                    <Link
                        to="/workoutplans"
                        className="member-summary-card"
                        style={{
                            textDecoration: "none",
                            color: "inherit"
                        }}
                    >

                        <div className="summary-icon workout-icon">
                            🏋️
                        </div>

                        <div>

                            <p>
                                Today's Workout
                            </p>

                            <h3>
                                {workout
                                    ? "AI Workout"
                                    : "No Workout"}
                            </h3>

                            <span>
                                {workout
                                    ? "Personalized Plan"
                                    : "Create your plan"}
                            </span>

                        </div>

                    </Link>



                    {/* =================================================
                        DIET
                    ================================================= */}

                    <Link
                        to="/diet"
                        className="member-summary-card"
                        style={{
                            textDecoration: "none",
                            color: "inherit"
                        }}
                    >

                        <div className="summary-icon diet-icon">
                            🥗
                        </div>

                        <div>

                            <p>
                                Today's Diet
                            </p>

                            <h3>
                                {diet
                                    ? "AI Diet"
                                    : "No Diet"}
                            </h3>

                            <span>
                                {diet
                                    ? "Personalized Plan"
                                    : "Create your plan"}
                            </span>

                        </div>

                    </Link>



                    {/* =================================================
                        ATTENDANCE
                    ================================================= */}

                    <Link
                        to="/my-attendance"
                        className="member-summary-card"
                        style={{
                            textDecoration: "none",
                            color: "inherit"
                        }}
                    >

                        <div className="summary-icon attendance-icon">
                            📅
                        </div>

                        <div>

                            <p>
                                Attendance
                            </p>

                            <h3>
                                My Attendance
                            </h3>

                            <span>
                                View attendance history
                            </span>

                        </div>

                    </Link>



                    {/* =================================================
                        MEMBERSHIP
                    ================================================= */}

                    <div className="member-summary-card">

                        <div className="summary-icon membership-icon">
                            💳
                        </div>

                        <div>

                            <p>
                                Membership
                            </p>

                            <h3>
                                {subscription?.plan?.name ||
                                    profile?.membership ||
                                    "No Plan"}
                            </h3>

                            <span>

                                {daysRemaining !== "-"
                                    ? `${daysRemaining} Days Remaining`
                                    : "No active subscription"}

                            </span>

                        </div>

                    </div>



                    {/* =================================================
                        WEIGHT
                    ================================================= */}

                    <div className="member-summary-card">

                        <div className="summary-icon progress-icon">
                            ⚖️
                        </div>

                        <div>

                            <p>
                                Current Weight
                            </p>

                            <h3>
                                {profile?.weight
                                    ? `${profile.weight} kg`
                                    : "-"}
                            </h3>

                            <span>

                                {profile?.height
                                    ? `Height: ${profile.height} cm`
                                    : "Update your profile"}

                            </span>

                        </div>

                    </div>

                </div>



                {/* =================================================
                    WORKOUT + MEMBERSHIP
                ================================================= */}

                <div className="member-main-grid">


                    {/* =================================================
                        MY AI WORKOUT
                    ================================================= */}

                    <div className="member-card workout-card">

                        <div className="member-card-header">

                            <div>

                                <p className="card-label">
                                    MY AI WORKOUT
                                </p>

                                <h2>

                                    {workout
                                        ? "Personalized Workout"
                                        : "No Workout Yet"}

                                </h2>

                            </div>


                            <span className="card-icon">
                                🤖
                            </span>

                        </div>



                        {workout ? (

                            <>

                                {/* WORKOUT SUMMARY */}

                                <div className="workout-summary">


                                    <div className="workout-info-item">

                                        <span>
                                            Goal
                                        </span>

                                        <strong>
                                            {workout.goal || "-"}
                                        </strong>

                                    </div>



                                    <div className="workout-info-item">

                                        <span>
                                            Experience
                                        </span>

                                        <strong>
                                            {workout.experience || "-"}
                                        </strong>

                                    </div>



                                    <div className="workout-info-item">

                                        <span>
                                            Schedule
                                        </span>

                                        <strong>
                                            {workout.workoutDays
                                                ? `${workout.workoutDays} Days / Week`
                                                : "-"}
                                        </strong>

                                    </div>



                                    <div className="workout-info-item">

                                        <span>
                                            Equipment
                                        </span>

                                        <strong>
                                            {workout.equipment || "-"}
                                        </strong>

                                    </div>

                                </div>



                                {/* SAVED MESSAGE */}

                                <div className="saved-workout-message">

                                    <span>
                                        ✅
                                    </span>

                                    <div>

                                        <strong>
                                            Your personalized workout is ready
                                        </strong>

                                        <p>
                                            Your AI-generated workout is saved
                                            and available whenever you need it.
                                        </p>

                                    </div>

                                </div>



                                {/* VIEW FULL WORKOUT */}

                                <Link
                                    to="/workoutplans"
                                    className="member-primary-button"
                                    style={{
                                        display: "block",
                                        textAlign: "center",
                                        textDecoration: "none"
                                    }}
                                >
                                    View My Full Workout →
                                </Link>

                            </>

                        ) : (

                            <>

                                <div className="no-workout-message">

                                    <span>
                                        🤖
                                    </span>

                                    <div>

                                        <strong>
                                            No AI workout generated yet
                                        </strong>

                                        <p>
                                            Create a personalized workout
                                            based on your goals and experience.
                                        </p>

                                    </div>

                                </div>



                                <Link
                                    to="/workoutplans"
                                    className="member-primary-button"
                                    style={{
                                        display: "block",
                                        textAlign: "center",
                                        textDecoration: "none"
                                    }}
                                >
                                    Create AI Workout →
                                </Link>

                            </>

                        )}

                    </div>



                    {/* =================================================
                        MEMBERSHIP
                    ================================================= */}

                    <div className="member-card">

                        <div className="member-card-header">

                            <div>

                                <p className="card-label">
                                    MY MEMBERSHIP
                                </p>

                                <h2>
                                    {subscription?.plan?.name ||
                                        profile?.membership ||
                                        "No Plan"}
                                </h2>

                            </div>


                            {subscription && (

                                <span className="active-badge">

                                    {subscription.status ||
                                        "ACTIVE"}

                                </span>

                            )}

                        </div>



                        {subscription ? (

                            <>

                                <div className="membership-details">


                                    <div>

                                        <span>
                                            Started
                                        </span>

                                        <strong>
                                            {formatDate(
                                                subscription.startDate
                                            )}
                                        </strong>

                                    </div>



                                    <div>

                                        <span>
                                            Expires
                                        </span>

                                        <strong>
                                            {formatDate(
                                                subscription.expiryDate
                                            )}
                                        </strong>

                                    </div>

                                </div>



                                <div className="membership-progress">

                                    <div className="progress-header">

                                        <span>
                                            Membership Progress
                                        </span>

                                        <strong>
                                            {membershipProgress}%
                                        </strong>

                                    </div>



                                    <div className="progress-bar">

                                        <div
                                            className="progress-fill"
                                            style={{
                                                width:
                                                    `${membershipProgress}%`
                                            }}
                                        />

                                    </div>



                                    <p>
                                        {daysRemaining} days remaining
                                    </p>

                                </div>



                                <Link
                                    to="/subscription"
                                    className="member-secondary-button"
                                    style={{
                                        display: "block",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        boxSizing: "border-box"
                                    }}
                                >
                                    View Subscription →
                                </Link>

                            </>

                        ) : (

                            <>

                                <div className="no-workout-message">

                                    <span>
                                        💳
                                    </span>

                                    <div>

                                        <strong>
                                            No active membership
                                        </strong>

                                        <p>
                                            Subscribe to a plan to access
                                            gym services.
                                        </p>

                                    </div>

                                </div>



                                <Link
                                    to="/subscription"
                                    className="member-primary-button"
                                    style={{
                                        display: "block",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        boxSizing: "border-box"
                                    }}
                                >
                                    View Subscription Plans →
                                </Link>

                            </>

                        )}

                    </div>

                </div>



                {/* =================================================
                    AI DIET
                ================================================= */}

                <div className="member-card member-diet-card">

                    <div className="member-card-header">

                        <div>

                            <p className="card-label">
                                MY AI DIET
                            </p>

                            <h2>
                                {diet
                                    ? "Personalized Diet"
                                    : "No Diet Yet"}
                            </h2>

                        </div>

                        <span className="card-icon">
                            🥗
                        </span>

                    </div>



                    {diet ? (

                        <>

                            {/* DIET SUMMARY */}

                            <div className="workout-summary">


                                <div className="workout-info-item">

                                    <span>
                                        Goal
                                    </span>

                                    <strong>
                                        {diet.goal || "-"}
                                    </strong>

                                </div>



                                <div className="workout-info-item">

                                    <span>
                                        Diet Type
                                    </span>

                                    <strong>
                                        {diet.dietPreference || "-"}
                                    </strong>

                                </div>



                                <div className="workout-info-item">

                                    <span>
                                        Activity
                                    </span>

                                    <strong>
                                        {diet.activityLevel || "-"}
                                    </strong>

                                </div>



                                <div className="workout-info-item">

                                    <span>
                                        Weight
                                    </span>

                                    <strong>
                                        {diet.weight
                                            ? `${diet.weight} kg`
                                            : "-"}
                                    </strong>

                                </div>

                            </div>



                            {/* SAVED DIET MESSAGE */}

                            <div className="saved-workout-message">

                                <span>
                                    ✅
                                </span>

                                <div>

                                    <strong>
                                        Your personalized diet is ready
                                    </strong>

                                    <p>
                                        Your AI-generated nutrition plan
                                        is saved and available anytime.
                                    </p>

                                </div>

                            </div>



                            {/* VIEW FULL DIET */}

                            <Link
                                to="/diet"
                                className="member-primary-button"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    textDecoration: "none"
                                }}
                            >
                                View My Full Diet →
                            </Link>

                        </>

                    ) : (

                        <>

                            <div className="no-workout-message">

                                <span>
                                    🥗
                                </span>

                                <div>

                                    <strong>
                                        No AI diet generated yet
                                    </strong>

                                    <p>
                                        Create a personalized diet
                                        based on your goals and preferences.
                                    </p>

                                </div>

                            </div>



                            <Link
                                to="/diet"
                                className="member-primary-button"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    textDecoration: "none"
                                }}
                            >
                                Create AI Diet →
                            </Link>

                        </>

                    )}

                </div>



                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="quick-actions-section">

                    <div className="section-heading">

                        <h2>
                            Quick Actions
                        </h2>

                    </div>



                    <div className="quick-actions-grid">


                        {/* WORKOUT */}

                        <Link
                            to="/workoutplans"
                            className="quick-action"
                        >

                            <span>
                                🏋️
                            </span>

                            <div>

                                <strong>
                                    My Workout
                                </strong>

                                <small>
                                    View AI workout
                                </small>

                            </div>

                        </Link>



                        {/* DIET */}

                        <Link
                            to="/diet"
                            className="quick-action"
                        >

                            <span>
                                🥗
                            </span>

                            <div>

                                <strong>
                                    My Diet
                                </strong>

                                <small>
                                    View AI diet
                                </small>

                            </div>

                        </Link>



                        {/* ATTENDANCE */}

                        <Link
                            to="/my-attendance"
                            className="quick-action"
                        >

                            <span>
                                📅
                            </span>

                            <div>

                                <strong>
                                    Attendance
                                </strong>

                                <small>
                                    View attendance
                                </small>

                            </div>

                        </Link>



                        {/* PAYMENTS */}

                        <Link
                            to="/my-payments"
                            className="quick-action"
                        >

                            <span>
                                💰
                            </span>

                            <div>

                                <strong>
                                    Payments
                                </strong>

                                <small>
                                    View payment history
                                </small>

                            </div>

                        </Link>

                    </div>

                </div>

            </div>

        

    );

}


export default MemberHome;