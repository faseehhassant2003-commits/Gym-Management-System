import { useEffect, useState } from "react";

function SubscribedMembers() {

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch subscriptions
    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/member-subscriptions/admin/all"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch subscriptions");
            }

            const data = await response.json();

            setSubscriptions(data);

        } catch (error) {

            console.error(error);
            alert("Failed to load subscribed members");

        } finally {

            setLoading(false);
        }
    };


    // 2. PASTE YOUR DEACTIVATE FUNCTION HERE
    const deactivateSubscription = async (subscriptionId) => {

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this subscription?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/member-subscriptions/admin/${subscriptionId}/deactivate`,
                {
                    method: "PUT"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to deactivate subscription");
            }

            alert("Subscription deactivated successfully");

            fetchSubscriptions();

        } catch (error) {

            console.error(error);
            alert("Failed to deactivate subscription");

        }
    };


    // 3. Then comes your return
    if (loading) {
        return <p>Loading subscriptions...</p>;
    }

    return (
        <div>

            <h2>Subscribed Members</h2>

            {subscriptions.length === 0 ? (

                <p>No subscribed members found.</p>

            ) : (

                <div>

                    {subscriptions.map((subscription) => (

                        <div key={subscription.id}>

                            <p>
                                Member: {subscription.member.name}
                            </p>

                            <p>
                                Plan: {subscription.plan.name}
                            </p>

                            <p>
                                Start Date: {subscription.startDate}
                            </p>

                            <p>
                                Expiry Date: {subscription.expiryDate}
                            </p>

                            <p>
                                Status: {subscription.status}
                            </p>


                           {subscription.status === "ACTIVE" && (
                                    <button
                                        onClick={() =>
                                            deactivateSubscription(subscription.id)
                                        }
                                    >
                                        Deactivate
                                    </button>
                                )}
                               {subscription.status === "ACTIVE" && (
                                <button
                                    onClick={() =>
                                        deactivateSubscription(subscription.id)
                                    }
                                >
                                    Deactivate
                                </button>
                            )}

                            <hr />

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default SubscribedMembers;