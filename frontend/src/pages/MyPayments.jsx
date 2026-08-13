import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import { getMyPayments } from "../api/PaymentApi";

function MyPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        try {
            setLoading(true);

            const response = await getMyPayments();

            setPayments(response.data);
        } catch (err) {
            console.error("Failed to load payments:", err);

            setError("Unable to load your payments.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="container mt-4">

                <h2 className="mb-4">My Payments</h2>

                {loading && (
                    <div className="alert alert-info">
                        Loading payments...
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {!loading && !error && payments.length === 0 && (
                    <div className="alert alert-info">
                        You have no payment records yet.
                    </div>
                )}

                {!loading && payments.length > 0 && (
                    <div className="table-responsive">

                        <table className="table table-bordered table-striped">

                            <thead className="table-dark">
                                <tr>
                                    <th>Payment ID</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Razorpay Payment ID</th>
                                </tr>
                            </thead>

                            <tbody>

                                {payments.map((payment) => (
                                    <tr key={payment.id}>

                                        <td>
                                            {payment.id}
                                        </td>

                                        <td>
                                            ₹{payment.amount}
                                        </td>

                                        <td>
                                            {payment.paymentDate}
                                        </td>

                                        <td>
                                            {payment.paymentMethod || "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    payment.status === "SUCCESS"
                                                        ? "badge bg-success"
                                                        : "badge bg-warning text-dark"
                                                }
                                            >
                                                {payment.status}
                                            </span>
                                        </td>

                                        <td>
                                            {payment.razorpayPaymentId || "-"}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>
        </Layout>
    );
}

export default MyPayments;