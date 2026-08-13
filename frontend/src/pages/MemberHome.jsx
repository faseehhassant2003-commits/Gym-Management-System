import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMemberProfile } from "../api/memberApi";
import { getActiveSubscription } from "../api/MemberSubscriptionApi";

import "./MemberHome.css";

function MemberHome() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // LOAD MEMBER HOME DATA
  // =========================================================

  useEffect(() => {
    loadMemberHome();
  }, []);

  async function loadMemberHome() {
    try {
      setLoading(true);
      setError(null);

      // -----------------------------------------------------
      // GET LOGGED-IN MEMBER PROFILE
      // -----------------------------------------------------

      const profileResponse = await getMemberProfile();

      const member = profileResponse.data;

      setProfile(member);

      // -----------------------------------------------------
      // GET ACTIVE SUBSCRIPTION
      // -----------------------------------------------------

      try {
        const subscriptionResponse =
          await getActiveSubscription(member.id);

        setActiveSubscription(subscriptionResponse.data);
      } catch (subscriptionError) {
        // Member may not have an active subscription
        setActiveSubscription(null);
      }

    } catch (error) {
      console.error(
        "Failed to load member home:",
        error
      );

      setError(
        error.response?.data ||
          "Failed to load member information."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // DATE HELPERS
  // =========================================================

  function parseDate(dateString) {
    if (!dateString) {
      return null;
    }

    const [year, month, day] =
      dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "-";
    }

    const [year, month, day] =
      dateString.split("-");

    return `${day} ${getMonthName(month)} ${year}`;
  }

  function getMonthName(month) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months[Number(month) - 1];
  }

  // =========================================================
  // CALCULATE DAYS REMAINING
  // =========================================================

  function getDaysRemaining() {
    if (!activeSubscription?.expiryDate) {
      return 0;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiryDate =
      parseDate(activeSubscription.expiryDate);

    if (!expiryDate) {
      return 0;
    }

    const difference =
      expiryDate.getTime() - today.getTime();

    const days =
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

    return Math.max(days, 0);
  }

  // =========================================================
  // CALCULATE MEMBERSHIP PROGRESS
  // =========================================================

  function getMembershipProgress() {
    if (
      !activeSubscription?.startDate ||
      !activeSubscription?.expiryDate
    ) {
      return 0;
    }

    const startDate =
      parseDate(activeSubscription.startDate);

    const expiryDate =
      parseDate(activeSubscription.expiryDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (!startDate || !expiryDate) {
      return 0;
    }

    const totalDuration =
      expiryDate.getTime() -
      startDate.getTime();

    const elapsed =
      today.getTime() -
      startDate.getTime();

    if (totalDuration <= 0) {
      return 100;
    }

    const percentage =
      (elapsed / totalDuration) * 100;

    return Math.min(
      Math.max(Math.round(percentage), 0),
      100
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="member-home-loading">
        <div className="loading-spinner"></div>
        <p>Loading your fitness dashboard...</p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="member-home-error">
        <h2>Unable to load your dashboard</h2>

        <p>
          Please refresh the page and try again.
        </p>

        <button
          onClick={loadMemberHome}
          className="member-primary-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // =========================================================
  // REAL MEMBER DATA
  // =========================================================

  const memberName =
    profile.name || "Member";

  const weight =
    profile.weight ?? "-";

  const height =
    profile.height ?? "-";

  const membership =
    profile.membership || "No Membership";

  const daysRemaining =
    getDaysRemaining();

  const membershipProgress =
    getMembershipProgress();

  const subscriptionStatus =
    activeSubscription?.status || "INACTIVE";

  const subscriptionPlan =
    activeSubscription?.plan?.name ||
    membership ||
    "No Plan";

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="member-home">

      {/* =====================================================
          WELCOME SECTION
      ====================================================== */}

      <div className="member-welcome">

        <div>

          <p className="member-welcome-small">
            WELCOME BACK 👋
          </p>

          <h1>
            Hello, {memberName}!
          </h1>

          <p className="member-quote">
            "Consistency is the key to transformation."
          </p>

        </div>

        <div className="welcome-icon">
          🏋️
        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="member-summary-grid">

        {/* WORKOUT */}

        <div className="member-summary-card">

          <div className="summary-icon workout-icon">
            🏋️
          </div>

          <div>

            <p>
              Today's Workout
            </p>

            <h3>
              Chest & Triceps
            </h3>

            <span>
              5 Exercises
            </span>

          </div>

        </div>


        {/* ATTENDANCE */}

        <div className="member-summary-card">

          <div className="summary-icon attendance-icon">
            🔥
          </div>

          <div>

            <p>
              Attendance
            </p>

            <h3>
              12 Visits
            </h3>

            <span>
              This Month
            </span>

          </div>

        </div>


        {/* MEMBERSHIP */}

        <div className="member-summary-card">

          <div className="summary-icon membership-icon">
            💳
          </div>

          <div>

            <p>
              Membership
            </p>

            <h3>
              {subscriptionPlan}
            </h3>

            <span>
              {activeSubscription
                ? `${daysRemaining} Days Remaining`
                : "No Active Subscription"}
            </span>

          </div>

        </div>


        {/* WEIGHT */}

        <div className="member-summary-card">

          <div className="summary-icon progress-icon">
            ⚖️
          </div>

          <div>

            <p>
              Current Weight
            </p>

            <h3>
              {weight} kg
            </h3>

            <span>
              Height: {height} cm
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="member-main-grid">

        {/* ===================================================
            TODAY'S WORKOUT
        ==================================================== */}

        <div className="member-card workout-card">

          <div className="member-card-header">

            <div>

              <p className="card-label">
                TODAY'S PLAN
              </p>

              <h2>
                Chest & Triceps
              </h2>

            </div>

            <span className="card-icon">
              💪
            </span>

          </div>


          <div className="exercise-list">

            <div className="exercise-row">

              <div>

                <strong>
                  Bench Press
                </strong>

                <span>
                  Chest
                </span>

              </div>

              <b>
                4 × 10
              </b>

            </div>


            <div className="exercise-row">

              <div>

                <strong>
                  Incline Dumbbell Press
                </strong>

                <span>
                  Upper Chest
                </span>

              </div>

              <b>
                3 × 12
              </b>

            </div>


            <div className="exercise-row">

              <div>

                <strong>
                  Cable Fly
                </strong>

                <span>
                  Chest
                </span>

              </div>

              <b>
                3 × 12
              </b>

            </div>


            <div className="exercise-row">

              <div>

                <strong>
                  Triceps Pushdown
                </strong>

                <span>
                  Triceps
                </span>

              </div>

              <b>
                3 × 15
              </b>

            </div>

          </div>


          <button
            className="member-primary-button"
            onClick={() =>
              navigate("/workoutplans")
            }
          >
            View My Workout →
          </button>

        </div>


        {/* ===================================================
            MEMBERSHIP
        ==================================================== */}

        <div className="member-card membership-card">

          <div className="member-card-header">

            <div>

              <p className="card-label">
                MY MEMBERSHIP
              </p>

              <h2>
                {subscriptionPlan}
              </h2>

            </div>

            <span
              className={
                subscriptionStatus === "ACTIVE"
                  ? "active-badge"
                  : "inactive-badge"
              }
            >
              {subscriptionStatus}
            </span>

          </div>


          {activeSubscription ? (

            <>

              <div className="membership-details">

                <div>

                  <span>
                    Started
                  </span>

                  <strong>
                    {formatDate(
                      activeSubscription.startDate
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Expires
                  </span>

                  <strong>
                    {formatDate(
                      activeSubscription.expiryDate
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
                      width: `${membershipProgress}%`,
                    }}
                  ></div>

                </div>


                <p>
                  {daysRemaining} days remaining
                </p>

              </div>

            </>

          ) : (

            <div className="no-subscription-message">

              <p>
                You don't have an active
                subscription.
              </p>

            </div>

          )}


          <button
            className="member-secondary-button"
            onClick={() =>
              navigate("/subscription")
            }
          >
            View Subscription →
          </button>

        </div>

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="quick-actions-section">

        <div className="section-heading">

          <p className="card-label">
            QUICK ACCESS
          </p>

          <h2>
            What would you like to do?
          </h2>

        </div>


        <div className="quick-actions-grid">

          <button
            onClick={() =>
              navigate("/workoutplans")
            }
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
                View your workout plan
              </small>

            </div>

          </button>


          <button
            onClick={() =>
              navigate("/diet")
            }
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
                View your nutrition plan
              </small>

            </div>

          </button>


          <button
            onClick={() =>
              navigate("/my-attendance")
            }
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
                Check your gym visits
              </small>

            </div>

          </button>


          <button
            onClick={() =>
              navigate("/my-payments")
            }
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

          </button>

        </div>

      </div>

    </div>
  );
}

export default MemberHome;