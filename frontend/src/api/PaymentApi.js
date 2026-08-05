import api from "./api";

export const getPayments=()=>
    api.get("/payments");
export const addPayment=(payment)=>
    api.post("/payments",payment);
export const updatePayment=(id,payment)=>
    api.put(`/payments/${id}`, payment);
export const deletePayment=(id)=>
 api.delete(`/payments/${id}`);