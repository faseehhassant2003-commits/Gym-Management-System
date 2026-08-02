import axios from "axios";

const API_URL="http://localhost:8080/payments";

export const getPayments=()=>
    axios.get(API_URL);
export const addPayment=(payment)=>
    axios.post(API_URL,payment);
export const updatePayment=(id,payment)=>
    axios.put(`${API_URL}/${id}`, payment);
export const deletePayment=(id)=>
 axios.delete(`${API_URL}/${id}`);