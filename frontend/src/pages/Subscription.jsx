import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";

import {
  getActiveSubscriptionPlans,
} from "../api/SubscriptionPlanApi";

 import { getActiveSubscription } from "../api/MemberSubscriptionApi";


import {
  createPaymentOrder,
  verifyPayment,
} from "../api/PaymentApi";

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

async function handleSubscribe(plan) {

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
    `Are you sure you want to subscribe to ${plan.name} for ₹${Number(plan.price).toLocaleString("en-IN")}?`
  );

  if (!confirmed) {
    return;
  }

  try {

    setSubscribing(true);

    // ==========================================
    // STEP 1: CREATE RAZORPAY ORDER
    // ==========================================

    const orderResponse =
      await createPaymentOrder(
        profile.id,
        plan.id
      );

    const order = orderResponse.data;

    console.log(
      "Razorpay order:",
      order
    );


    // ==========================================
    // STEP 2: OPEN RAZORPAY CHECKOUT
    // ==========================================

    const options = {

      key: order.keyId,

      amount: order.amount,

      currency: order.currency,

      name: "Gym Management System",

      description:
        `${plan.name} Membership`,

      order_id:
        order.orderId,

      prefill: {

        name: profile.name,

        email: profile.username,

        contact: profile.phone,

      },

      theme: {

        color: "#0d6efd",

      },


      // ========================================
      // STEP 3: PAYMENT SUCCESS
      // ========================================

      handler: async function (response) {

        console.log(
          "Razorpay response:",
          response
        );

        try {

          // ======================================
          // STEP 4: VERIFY PAYMENT
          // ======================================

          const verificationResponse =
            await verifyPayment({

              memberId: profile.id,

              planId: plan.id,

              razorpayOrderId:
                response.razorpay_order_id,

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpaySignature:
                response.razorpay_signature,

            });


          console.log(
            "Payment verification:",
            verificationResponse.data
          );


          // ======================================
          // STEP 5: SUCCESS
          // ======================================

          alert(
            "Payment successful! Your subscription is now active."
          );

          await loadSubscriptionData();

        } catch (error) {

          console.error(
            "Payment verification failed:",
            error
          );

          alert(
            error.response?.data?.message ||
            error.response?.data ||
            "Payment verification failed."
          );

        } finally {

          setSubscribing(false);

        }

      },


      // ========================================
      // PAYMENT FAILED
      // ========================================

      modal: {

        ondismiss: function () {

          console.log(
            "Razorpay checkout closed"
          );

          setSubscribing(false);

        },

      },

    };


    // ==========================================
    // STEP 6: CREATE RAZORPAY CHECKOUT
    // ==========================================

    if (!window.Razorpay) {

      alert(
        "Razorpay Checkout is not loaded."
      );

      setSubscribing(false);

      return;

    }


    const razorpay =
      new window.Razorpay(options);


    razorpay.open();


  } catch (error) {

    console.error(
      "Unable to create payment:",
      error
    );

    alert(
      error.response?.data?.message ||
      error.response?.data ||
      "Unable to create payment order."
    );

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
                        handleSubscribe(plan)
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