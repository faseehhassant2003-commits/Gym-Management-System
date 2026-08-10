import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";

import {
  getSubscriptionPlans,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../api/SubscriptionPlanApi";

import "./SubscriptionPlans.css";

function SubscriptionPlans() {

  const [plans, setPlans] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingPlan, setEditingPlan] = useState(null);

  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const response = await getSubscriptionPlans();
      setPlans(response.data);
    } catch (error) {
      console.error("Unable to load subscription plans", error);
    }
  }

  function openAddForm() {
    setEditingPlan(null);

    setName("");
    setDurationDays("");
    setPrice("");
    setDescription("");

    setShowForm(true);
  }

  function openEditForm(plan) {
    setEditingPlan(plan);

    setName(plan.name);
    setDurationDays(plan.durationDays);
    setPrice(plan.price);
    setDescription(plan.description || "");

    setShowForm(true);
  }

  function cancelForm() {
    setEditingPlan(null);

    setName("");
    setDurationDays("");
    setPrice("");
    setDescription("");

    setShowForm(false);
  }

  async function savePlan() {

    if (!name.trim()) {
      alert("Please enter plan name");
      return;
    }

    if (!durationDays || Number(durationDays) <= 0) {
      alert("Please enter a valid duration");
      return;
    }

    if (price === "" || Number(price) < 0) {
      alert("Please enter a valid price");
      return;
    }

    const planData = {
      name: name.trim(),
      durationDays: Number(durationDays),
      price: Number(price),
      description: description.trim(),
      active: editingPlan
        ? editingPlan.active
        : true,
    };

    try {

      if (editingPlan) {

        await updateSubscriptionPlan(
          editingPlan.id,
          planData
        );

      } else {

        await addSubscriptionPlan(planData);

      }

      await loadPlans();

      cancelForm();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to save subscription plan"
      );
    }
  }

  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription plan?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await deleteSubscriptionPlan(id);

      await loadPlans();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to delete subscription plan"
      );
    }
  }

  async function handleDeactivate(plan) {

    const updatedPlan = {
      name: plan.name,
      durationDays: plan.durationDays,
      price: plan.price,
      description: plan.description || "",
      active: !plan.active,
    };

    try {

      await updateSubscriptionPlan(
        plan.id,
        updatedPlan
      );

      await loadPlans();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to update plan"
      );
    }
  }

  return (
    <Layout>

      <div className="subscription-plans-page">

        {/* Header */}

        <div className="subscription-header d-flex justify-content-between align-items-center mb-4">

          <div>

            <h1 className="page-title">
              Subscription Plans
            </h1>

            <p className="page-subtitle text-muted">
              Manage gym membership plans, prices and durations.
            </p>

          </div>

          <button
            className="btn btn-primary"
            onClick={openAddForm}
          >
            + Add Plan
          </button>

        </div>


        {/* Add / Edit Form */}

        {showForm && (

          <div className="card subscription-form-card mb-4">

            <div className="card-body">

              <h4 className="mb-4">

                {editingPlan
                  ? "Update Subscription Plan"
                  : "Add Subscription Plan"}

              </h4>


              <div className="subscription-form-grid">

                <div>

                  <label className="form-label">
                    Plan Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Gold"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>


                <div>

                  <label className="form-label">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="30"
                    min="1"
                    value={durationDays}
                    onChange={(e) =>
                      setDurationDays(e.target.value)
                    }
                  />

                </div>


                <div>

                  <label className="form-label">
                    Price
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="1000"
                    min="0"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                  />

                </div>


                <div>

                  <label className="form-label">
                    Description
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Basic gym membership"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />

                </div>

              </div>


              <div className="mt-4">

                <button
                  className="btn btn-success me-2"
                  onClick={savePlan}
                >
                  {editingPlan
                    ? "Update Plan"
                    : "Save Plan"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={cancelForm}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}


        {/* Plans */}

        <div className="subscription-plan-grid">

          {plans.map((plan) => (

            <div
              className={`subscription-plan-card ${
                !plan.active
                  ? "inactive-plan"
                  : ""
              }`}
              key={plan.id}
            >

              <div className="plan-card-header">

                <div>

                  <h3>
                    {plan.name}
                  </h3>

                  <span
                    className={
                      plan.active
                        ? "plan-status active"
                        : "plan-status inactive"
                    }
                  >
                    {plan.active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              </div>


              <div className="plan-price">

                ₹{Number(plan.price).toLocaleString("en-IN")}

              </div>


              <div className="plan-duration">

                {plan.durationDays} days

              </div>


              <p className="plan-description">

                {plan.description ||
                  "No description available."}

              </p>


              <div className="plan-actions">

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() =>
                    openEditForm(plan)
                  }
                >
                  Edit
                </button>


                <button
                  className={`btn btn-sm ${
                    plan.active
                      ? "btn-secondary"
                      : "btn-success"
                  }`}
                  onClick={() =>
                    handleDeactivate(plan)
                  }
                >
                  {plan.active
                    ? "Deactivate"
                    : "Activate"}
                </button>


                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    handleDelete(plan.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>


        {plans.length === 0 && (

          <div className="empty-plans">

            <h4>No subscription plans</h4>

            <p>
              Add your first gym membership plan.
            </p>

            <button
              className="btn btn-primary"
              onClick={openAddForm}
            >
              + Add Plan
            </button>

          </div>

        )}

      </div>

    </Layout>
  );
}

export default SubscriptionPlans;