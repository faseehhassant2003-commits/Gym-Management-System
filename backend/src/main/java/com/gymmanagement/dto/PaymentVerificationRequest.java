package com.gymmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentVerificationRequest {

    private Long memberId;

    private Long planId;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}