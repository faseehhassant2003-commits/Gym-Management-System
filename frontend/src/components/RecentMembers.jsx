import { useEffect, useState } from "react";
import api from "../api/api";
function RecentMembers() {

    const [members, setMembers] = useState([]);

    useEffect(() => {
        loadRecentMembers();
    }, []);

    async function loadRecentMembers() {
        try {
           const response = await api.get(
    "/dashboard/recent-members");

            setMembers(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="card shadow-sm mt-4">

            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Recent Members</h5>
            </div>

            <div className="card-body">

                <table className="table table-hover">

                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Membership</th>
                        <th>Phone</th>
                    </tr>
                    </thead>

                    <tbody>

                    {members.map((member) => (

                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.membership}</td>
                            <td>{member.phone}</td>
                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default RecentMembers;