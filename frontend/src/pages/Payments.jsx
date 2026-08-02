import Layout from "../layouts/Layout";

import { useState,useEffect } from "react";

import {
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
}from "../api/PaymentApi";

function Payments() {
  const [showForm, setShowForm] = useState(false);

  const [memberName, setMemberName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState("Cash");
  const [status, setStatus] = useState("Paid");

  const [editingPayment, setEditingPayment] = useState(null);

  const [payments, setPayments] = useState([]);

  useEffect(()=>{
    loadPayments();
  },[]);

  async function loadPayments(){
    const response =await getPayments();
    setPayments(response.data);
  }

  async function savePayment() {
    if (memberName === "") {
      alert("Please enter member name");
      return;
    }

    if (amount === "") {
      alert("Please enter amount");
      return;
    }

    if (date === "") {
      alert("Please select date");
      return;
    }

    const newPayment = {
      memberName,
      amount,
      paymentDate:date,
      paymentMethod:method,
      status,
    };

    if (editingPayment === null) {
await addPayment(newPayment);
await loadPayments();
    } else {await updatePayment(editingPayment, newPayment);
await loadPayments();
setEditingPayment(null);
}

    setMemberName("");
    setAmount("");
    setDate("");
    setMethod("Cash");
    setStatus("Paid");
    setShowForm(false);
  }

  function editPayment(payment) {
    setMemberName(payment.memberName);
    setAmount(payment.amount);
    setDate(payment.paymentDate);
    setMethod(payment.paymentMethod);
    setStatus(payment.status);

    setEditingPayment(payment.id);

    setShowForm(true);
  }

  async function handleDelete(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this payment?"
  );

  if (!confirmDelete) {
    return;
  }

  await deletePayment(id);
  await loadPayments();}

  function cancelPayment() {
    setMemberName("");
    setAmount("");
    setDate("");
    setMethod("Cash");
    setStatus("Paid");

    setEditingPayment(null);
    setShowForm(false);
  }

  return (<Layout>
          <h2>Payment Management</h2>

          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowForm(true)}
          >
            + Add Payment
          </button>

          {showForm && (
            <div className="card p-3 mb-3">
              <h4>
                {editingPayment === null
                  ? "Add Payment"
                  : "Update Payment"}
              </h4>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Member Name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />

              <input
                type="number"
                className="form-control mb-3"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <input
                type="date"
                className="form-control mb-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                className="form-select mb-3"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
              </select>

              <select
                className="form-select mb-3"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Paid</option>
                <option>Pending</option>
              </select>

              <button
                className="btn btn-success me-2"
                onClick={savePayment}
              >
                {editingPayment === null
                  ? "Save Payment"
                  : "Update Payment"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={cancelPayment}
              >
                Cancel
              </button>
            </div>
          )}

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.memberName}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.status}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editPayment(payment)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(payment.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </Layout>
  );
}

export default Payments;