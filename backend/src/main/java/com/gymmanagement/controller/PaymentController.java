package com.gymmanagement.controller;

import com.gymmanagement.service.PaymentService;
import com.gymmanagement.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController

public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    @GetMapping("/payments")
    public List<Payment> getAllPayments(){
        return paymentService.getAllPayments();
    }
    @PostMapping("/payments")
    public Payment savePayment(@RequestBody Payment payment){
        return paymentService.savePayment(payment);
    }
    @PutMapping("payments/{id}")
    public Payment savePayment(@PathVariable Long id,@RequestBody Payment payment){
        return paymentService.updatePayment(id,payment);
    }
    @DeleteMapping("payments/{id}")
    public void deletePayment(@PathVariable Long id){
        paymentService.deletePayment(id);
    }


}
