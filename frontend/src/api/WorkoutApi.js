import api from "./api";

 export function generateWorkout(workoutRequest){
    return api.post(
        "/workout/generate",
        workoutRequest  );
    }
