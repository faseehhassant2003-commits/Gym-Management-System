import api from "./api";
export function generateDiet(dietRequest){
return api.post(
    "/diet/generate",
    dietRequest
    
    );
}