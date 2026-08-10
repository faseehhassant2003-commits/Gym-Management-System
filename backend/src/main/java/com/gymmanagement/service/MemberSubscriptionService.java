package com.gymmanagement.service;

import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.SubscriptionPlan;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.entity.MemberSubscription;
import com.gymmanagement.repository.MemberSubscriptionRepository;
import com.gymmanagement.repository.SubscriptionPlanRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MemberSubscriptionService {

    private final MemberSubscriptionRepository subscriptionRepository;
    private final MemberRepository memberRepository;
    private final SubscriptionPlanRepository planRepository;

    public MemberSubscriptionService(
            MemberSubscriptionRepository subscriptionRepository,
            MemberRepository memberRepository,
            SubscriptionPlanRepository planRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
    }

    // Subscribe a member to a plan
    public MemberSubscription subscribe(
            Long memberId,
            Long planId
    ) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException("Member not found"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException("Subscription plan not found"));

        if (!plan.isActive()) {
            throw new RuntimeException(
                    "This subscription plan is not active"
            );
        }

        // Check whether member already has an active subscription
        subscriptionRepository
                .findByMemberIdAndStatus(memberId, "ACTIVE")
                .ifPresent(existing -> {

                    throw new RuntimeException(
                            "Member already has an active subscription"
                    );

                });

        LocalDate startDate = LocalDate.now();

        LocalDate expiryDate =
                startDate.plusDays(plan.getDurationDays());

        MemberSubscription subscription =
                new MemberSubscription();

        subscription.setMember(member);
        subscription.setPlan(plan);
        subscription.setStartDate(startDate);
        subscription.setExpiryDate(expiryDate);
        subscription.setStatus("ACTIVE");

        return subscriptionRepository.save(subscription);
    }


    // Get all subscriptions of a member
    public List<MemberSubscription> getMemberSubscriptions(
            Long memberId
    ) {

        return subscriptionRepository.findByMemberId(memberId);
    }


    // Get current active subscription
    public MemberSubscription getActiveSubscription(
            Long memberId
    ) {

        return subscriptionRepository
                .findByMemberIdAndStatus(memberId, "ACTIVE")
                .orElse(null);
    }
}