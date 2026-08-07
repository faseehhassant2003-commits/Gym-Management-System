package com.gymmanagement.controller;

import com.gymmanagement.service.PaymentService;
import com.gymmanagement.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController

public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments")
    public List<Payment> getAllPayments(){
        return paymentService.getAllPayments();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/payments")
    public Payment savePayment(@RequestBody Payment payment){
        return paymentService.savePayment(payment);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("payments/{id}")
    public Payment savePayment(@PathVariable Long id,@RequestBody Payment payment){
        return paymentService.updatePayment(id,payment);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("payments/{id}")
    public void deletePayment(@PathVariable Long id){
        paymentService.deletePayment(id);
    }


}
