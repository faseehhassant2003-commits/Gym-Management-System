package com.gymmanagement.controller;

import com.gymmanagement.dto.PaymentResponse;
import com.gymmanagement.dto.PaymentVerificationRequest;
import com.gymmanagement.service.PaymentService;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import com.gymmanagement.entity.Payment;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest request
    ) {

        try {

            boolean verified =
                    paymentService.verifyPayment(
                            request.getMemberId(),
                            request.getPlanId(),
                            request.getRazorpayOrderId(),
                            request.getRazorpayPaymentId(),
                            request.getRazorpaySignature()
                    );

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "success",
                            verified,
                            "message",
                            "Payment verified and subscription activated"
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestParam Long memberId,
            @RequestParam Long planId
    ) {

        try {

            JSONObject response =
                    paymentService.createOrder(
                            memberId,
                            planId
                    );

            return ResponseEntity.ok(
                    response.toMap()
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/my")
    public ResponseEntity<?> getMyPayments() {

        try {

            List<PaymentResponse> payments =
                    paymentService.getMyPayments();

            return ResponseEntity.ok(payments);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}