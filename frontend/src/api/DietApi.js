import axios from "axios";

const BASE_URL="https://gym-management-system-rn77.onrender.com";
export function generateDiet(dietRequest){
return axios.post(
    BASE_URL+"/diet/generate",
    dietRequest
    
    );
}