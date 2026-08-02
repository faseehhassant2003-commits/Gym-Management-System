import axios from "axios";

const BASE_URL="http://localhost:8080";

export function generateDiet(dietRequest){
return axios.post(
    BASE_URL+"/diet/generate",
    dietRequest
    
    );
}