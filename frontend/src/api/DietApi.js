import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
export function generateDiet(dietRequest){
return axios.post(
    BASE_URL+"/diet/generate",
    dietRequest
    
    );
}