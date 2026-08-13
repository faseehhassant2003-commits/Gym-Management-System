package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PaymentResponse {

    private Long id;

    private Double amount;

    private LocalDateTime paymentDate;

    private String paymentMethod;

    private String status;

    private String razorpayOrderId;

    private String razorpayPaymentId;
}