package com.gymmanagement.service;
import com.gymmanagement.entity.Payment;
import com.gymmanagement.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    public List<Payment> getAllPayments(){
        return paymentRepository.findAll();
    }
    public Payment savePayment(Payment payment){
        return paymentRepository.save(payment);
    }
    public Payment updatePayment(Long id,Payment payment){
        payment.setId(id);
        return paymentRepository.save(payment);

    }
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
