package com.gymmanagement.repository;

import com.gymmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RazorpayRepository
        extends JpaRepository<Payment, Long> {

    List<Payment> findByMemberIdOrderByPaymentDateDesc(
            Long memberId
    );

    Optional<Payment> findByRazorpayOrderId(
            String razorpayOrderId
    );

    Optional<Payment> findByRazorpayPaymentId(
            String razorpayPaymentId
    );
}