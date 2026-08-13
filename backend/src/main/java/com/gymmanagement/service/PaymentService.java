package com.gymmanagement.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import com.gymmanagement.dto.PaymentResponse;

import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.Payment;
import com.gymmanagement.entity.SubscriptionPlan;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.MemberSubscriptionRepository;
import com.gymmanagement.repository.PaymentRepository;
import com.gymmanagement.repository.SubscriptionPlanRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.gymmanagement.entity.MemberSubscription;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final MemberRepository memberRepository;
    private final SubscriptionPlanRepository planRepository;
    private final PaymentRepository paymentRepository;
    private final MemberSubscriptionRepository memberSubscriptionRepository;
    @Value("${RAZORPAY_KEY_ID}")
    private String razorpayKeyId;

    @Value("${RAZORPAY_KEY_SECRET}")
    private String razorpayKeySecret;

    public PaymentService(
            MemberRepository memberRepository,
            SubscriptionPlanRepository planRepository,
            PaymentRepository paymentRepository,
            MemberSubscriptionRepository memberSubscriptionRepository

    ) {
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
        this.paymentRepository = paymentRepository;
        this.memberSubscriptionRepository = memberSubscriptionRepository;
    }

    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    public JSONObject createOrder(
            Long memberId,
            Long planId
    ) throws Exception {

        // 1. Find member
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException("Member not found")
                );

        // 2. Find subscription plan
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException("Subscription plan not found")
                );

        // 3. Check whether plan is active
        if (!plan.isActive()) {
            throw new RuntimeException(
                    "This subscription plan is not active"
            );
        }

        // 4. Get price directly from database
        double amount = plan.getPrice();

        // 5. Convert rupees to paise
        // Razorpay expects amount in paise
        int amountInPaise =
                (int) Math.round(amount * 100);

        // 6. Create Razorpay client
        RazorpayClient razorpayClient =
                new RazorpayClient(
                        razorpayKeyId,
                        razorpayKeySecret
                );

        // 7. Prepare Razorpay order request
        JSONObject orderRequest =
                new JSONObject();

        orderRequest.put(
                "amount",
                amountInPaise
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                "member_" + memberId + "_plan_" + planId
        );

        // 8. Create order in Razorpay
        Order order =
                razorpayClient.orders.create(
                        orderRequest
                );

        // 9. Convert Razorpay Order to JSONObject
        JSONObject orderJson =
                new JSONObject(order.toString());

        // 10. Get Razorpay order ID
        String orderId =
                orderJson.getString("id");

        // 11. Create our payment record
        Payment payment =
                new Payment();

        payment.setMember(member);

        payment.setAmount(amount);

        payment.setStatus("PENDING");

        payment.setPaymentDate(
                LocalDateTime.now()
        );

        payment.setRazorpayOrderId(
                orderId
        );

        // 12. Save payment as PENDING
        paymentRepository.save(payment);

        // 13. Prepare response for frontend
        JSONObject response =
                new JSONObject();

        response.put(
                "orderId",
                orderId
        );

        response.put(
                "amount",
                amountInPaise
        );

        response.put(
                "currency",
                "INR"
        );

        response.put(
                "keyId",
                razorpayKeyId
        );

        response.put(
                "memberId",
                memberId
        );

        response.put(
                "planId",
                planId
        );

        // 14. Return response
        return response;
    }
    public List<PaymentResponse> getMyPayments() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                authentication.getName() == null) {

            throw new RuntimeException(
                    "Authenticated user not found"
            );
        }

        String email = authentication.getName();

        Member member =
                memberRepository
                        .findByUserEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member profile not found"
                                )
                        );

        // Get only SUCCESS payments
        List<Payment> payments =
                paymentRepository
                        .findByMemberIdAndStatusOrderByPaymentDateDesc(
                                member.getId(),
                                "SUCCESS"
                        );

        // Convert Payment entities to PaymentResponse DTOs
        return payments.stream()
                .map(payment ->
                        new PaymentResponse(
                                payment.getId(),
                                payment.getAmount(),
                                payment.getPaymentDate(),
                                payment.getPaymentMethod(),
                                payment.getStatus(),
                                payment.getRazorpayOrderId(),
                                payment.getRazorpayPaymentId()
                        )
                )
                .toList();
    }
    //verify//
    public boolean verifyPayment(
            Long memberId,
            Long planId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) throws Exception {

        // 1. Find the payment created during create-order
        Payment payment =
                paymentRepository
                        .findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment order not found"
                                )
                        );

        // 2. Verify that the order belongs to this member
        if (!payment.getMember().getId().equals(memberId)) {
            throw new RuntimeException(
                    "Payment does not belong to this member"
            );
        }

        // 3. Generate the signature that Razorpay expects
        String generatedSignature =
                com.razorpay.Utils.getHash(
                        razorpayOrderId + "|" + razorpayPaymentId,
                        razorpayKeySecret
                );

        // 4. Compare signatures
        if (!generatedSignature.equals(razorpaySignature)) {

            payment.setStatus("FAILED");

            paymentRepository.save(payment);

            throw new RuntimeException(
                    "Payment signature verification failed"
            );
        }

        // 5. Find member
        Member member =
                memberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Member not found"
                                )
                        );

        // 6. Find plan
        SubscriptionPlan plan =
                planRepository.findById(planId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Subscription plan not found"
                                )
                        );

        // 7. Update payment
        payment.setRazorpayPaymentId(
                razorpayPaymentId
        );

        payment.setRazorpaySignature(
                razorpaySignature
        );

        payment.setPaymentMethod(
                "RAZORPAY"
        );

        payment.setStatus("SUCCESS");

        // 8. Create subscription
        MemberSubscription subscription =
                new MemberSubscription();

        subscription.setMember(member);
        subscription.setPlan(plan);

        LocalDate startDate =
                java.time.LocalDate.now();

        LocalDate expiryDate =
                startDate.plusDays(
                        plan.getDurationDays()
                );

        subscription.setStartDate(startDate);
        subscription.setExpiryDate(expiryDate);
        subscription.setStatus("ACTIVE");

        // 9. Connect payment to subscription
        payment.setSubscription(subscription);

        // 10. Save subscription
        memberSubscriptionRepository.save(subscription);

        // 11. Save successful payment
        paymentRepository.save(payment);

        return true;
    }


}