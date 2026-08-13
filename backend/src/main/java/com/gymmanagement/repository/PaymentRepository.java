package com.gymmanagement.repository;

import com.gymmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByMemberIdOrderByPaymentDateDesc(Long memberId);

    List<Payment> findByMemberIdAndStatusOrderByPaymentDateDesc(
            Long memberId,
            String status
    );

    List<Payment> findAllByOrderByPaymentDateDesc();

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);



    void deleteByMemberId(Long memberId);
}