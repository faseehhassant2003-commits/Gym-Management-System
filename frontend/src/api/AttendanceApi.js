import axios from "axios";

const API_URL="http://localhost:8080/attendance";

export const getAttendance=()=>
 axios.get(API_URL);


export const addAttendance=(attendance)=>
     axios.post(API_URL,attendance);



export const updateAttendance=(id,attendance)=>
    axios.put(`${API_URL}/${id}`,attendance);


export const deleteAttendance=(id)=>
    axios.delete(`${API_URL}/${id}`);
