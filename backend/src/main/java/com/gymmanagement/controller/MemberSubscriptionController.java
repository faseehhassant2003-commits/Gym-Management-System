package com.gymmanagement.controller;

import com.gymmanagement.entity.MemberSubscription;
import com.gymmanagement.service.MemberSubscriptionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member-subscriptions")
public class MemberSubscriptionController {

    private final MemberSubscriptionService service;

    public MemberSubscriptionController(
            MemberSubscriptionService service) {
        this.service = service;
    }

    // Subscribe a member to a plan
    @PostMapping("/subscribe")
    public ResponseEntity<MemberSubscription> subscribe(
            @RequestParam Long memberId,
            @RequestParam Long planId) {

        MemberSubscription subscription =
                service.subscribe(memberId, planId);

        return ResponseEntity.ok(subscription);
    }

    // Get all subscriptions of a member
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<MemberSubscription>> getMemberSubscriptions(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(
                service.getMemberSubscriptions(memberId)
        );
    }

    // Get current active subscription
    @GetMapping("/member/{memberId}/active")
    public ResponseEntity<MemberSubscription> getActiveSubscription(
            @PathVariable Long memberId) {

        MemberSubscription subscription =
                service.getActiveSubscription(memberId);

        return ResponseEntity.ok(subscription);
    }
}