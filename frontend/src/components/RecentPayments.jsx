import { useEffect, useState } from "react";
import api from "../api/api";

function RecentPayments() {

    const [payments, setPayments] = useState([]);

    useEffect(() => {
        api
            .get("/dashboard/recent-payments")
            .then((response) => {
                setPayments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching recent payments:", error);
            });
    }, []);

    return (
        <div className="card mt-4 shadow-sm">
            <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Recent Payments</h5>
            </div>

            <div className="card-body">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.memberName}</td>
                                <td>₹{payment.amount}</td>
                                <td>{payment.paymentDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentPayments;