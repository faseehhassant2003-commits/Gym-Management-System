import api from "./api";

export const getAttendance=()=>
 api.get("/attendance");


export const addAttendance=(attendance)=>
     api.post("/attendance",attendance);



export const updateAttendance=(id,attendance)=>
    api.put(`/attendance/${id}`,attendance);


export const deleteAttendance=(id)=>
    api.delete(`/attendance/${id}`);
