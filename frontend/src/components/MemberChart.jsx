import { useEffect, useState } from "react";
import api from "../api/api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function MemberChart() {
    const[stats,setstats]=useState([]);
const labels=stats.map(stat=>stat.membership);
const data={
    labels,
    datasets:[
        {
            label:"Members",
            data:stats.map(item=>item.count),
            backgroundColor:[  "#0d6efd",
                "#198754",
                "#ffc107"]
        }

    
    ]
};

    useEffect(() => {
        loadStats();
    }, []);


    async function loadStats() {
        try {
            const response = await api.get("/dashboard/member-stats");

            console.log(response.data);
            setstats(response.data);
        } catch (error) {
            console.error(error);
        }
    }





    return (
        <div className="card shadow-sm mt-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                    Members by Membership
                </h5>
            </div>
<div className="card-body">
    <Bar data={data} />
</div>
        </div>
    );
}

export default MemberChart;