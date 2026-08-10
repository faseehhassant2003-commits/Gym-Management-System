import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";

import {
  getActiveSubscriptionPlans,
} from "../api/SubscriptionPlanApi";

import {
  getActiveSubscription,
  subscribeToPlan,
} from "../api/MemberSubscriptionApi";

import { getMemberProfile } from "../api/memberApi";

function Subscription() {

  const [profile, setProfile] = useState(null);

  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  async function loadSubscriptionData() {

    try {

      setLoading(true);

      // Get logged-in member profile
      const profileResponse = await getMemberProfile();

      const member = profileResponse.data;

      setProfile(member);

      // Get active plans
      const plansResponse =
        await getActiveSubscriptionPlans();

      setPlans(plansResponse.data);

      // Get current subscription
      try {

        const subscriptionResponse =
          await getActiveSubscription(member.id);

        setActiveSubscription(
          subscriptionResponse.data
        );

      } catch (error) {

        // Member doesn't have an active subscription
        setActiveSubscription(null);
      }

    } catch (error) {

      console.error(
        "Failed to load subscription data:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  async function handleSubscribe(planId) {

    if (!profile) {
      return;
    }

    if (activeSubscription) {
      alert(
        "You already have an active subscription."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to subscribe to this plan?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setSubscribing(true);

      await subscribeToPlan(
        profile.id,
        planId
      );

      alert(
        "Subscription activated successfully!"
      );

      // Reload subscription information
      await loadSubscriptionData();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to subscribe to this plan."
      );

    } finally {

      setSubscribing(false);

    }
  }


  function formatDate(date) {

    if (!date) {
      return "-";
    }

    const [year, month, day] =
      date.split("-");

    return `${day}-${month}-${year.slice(-2)}`;
  }


  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          Loading subscription...
        </div>
      </Layout>
    );
  }


  return (
    <Layout>

      <div className="subscription-page">

        <div className="mb-4">

          <h1>
            Subscription
          </h1>

          <p className="text-muted">
            Manage your gym membership.
          </p>

        </div>


        {/* Current Subscription */}

        <div className="card mb-4">

          <div className="card-body">

            <h4 className="mb-3">
              My Current Subscription
            </h4>

            {activeSubscription ? (

              <div>

                <h3>
                  {activeSubscription.plan?.name}
                </h3>

                <p>
                  ₹
                  {activeSubscription.plan?.price}
                  {" / "}
                  {activeSubscription.plan?.durationDays}
                  {" days"}
                </p>

                <p>
                  <strong>
                    Start Date:
                  </strong>{" "}
                  {formatDate(
                    activeSubscription.startDate
                  )}
                </p>

                <p>
                  <strong>
                    Expiry Date:
                  </strong>{" "}
                  {formatDate(
                    activeSubscription.expiryDate
                  )}
                </p>

                <span className="badge bg-success">
                  {activeSubscription.status}
                </span>

              </div>

            ) : (

              <div className="alert alert-info mb-0">

                You don't have an active
                subscription.

              </div>

            )}

          </div>

        </div>


        {/* Available Plans */}

        <h4 className="mb-3">
          Available Plans
        </h4>


        <div className="row">

          {plans.map((plan) => (

            <div
              className="col-md-4 mb-4"
              key={plan.id}
            >

              <div className="card h-100">

                <div className="card-body">

                  <h3>
                    {plan.name}
                  </h3>

                  <h4 className="mt-3">
                    ₹
                    {Number(plan.price)
                      .toLocaleString("en-IN")}
                  </h4>

                  <p className="text-muted">
                    {plan.durationDays} days
                  </p>

                  <p>
                    {plan.description ||
                      "Gym membership plan"}
                  </p>

                  <button
                    className="btn btn-primary w-100"
                    disabled={
                      !!activeSubscription ||
                      subscribing
                    }
                    onClick={() =>
                      handleSubscribe(plan.id)
                    }
                  >

                    {activeSubscription
                      ? activeSubscription.plan?.id === plan.id
                        ? "Current Plan"
                        : "Unavailable"
                      : subscribing
                        ? "Processing..."
                        : "Subscribe"}

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>


        {plans.length === 0 && (

          <div className="alert alert-warning">

            No subscription plans are currently
            available.

          </div>

        )}

      </div>

    </Layout>
  );
}

export default Subscription;