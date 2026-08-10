package com.gymmanagement.controller;

import com.gymmanagement.entity.SubscriptionPlan;
import com.gymmanagement.service.SubscriptionPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
public class SubscriptionPlanController {

    private final SubscriptionPlanService service;

    public SubscriptionPlanController(
            SubscriptionPlanService service) {
        this.service = service;
    }

    // Get all plans
    @GetMapping
    public ResponseEntity<List<SubscriptionPlan>> getAllPlans() {
        return ResponseEntity.ok(
                service.getAllPlans()
        );
    }

    // Get active plans
    @GetMapping("/active")
    public ResponseEntity<List<SubscriptionPlan>> getActivePlans() {
        return ResponseEntity.ok(
                service.getActivePlans()
        );
    }

    // Get plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> getPlanById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getPlanById(id)
        );
    }

    // Create plan
    @PostMapping
    public ResponseEntity<SubscriptionPlan> createPlan(
            @RequestBody SubscriptionPlan plan) {

        return ResponseEntity.ok(
                service.createPlan(plan)
        );
    }

    // Update plan
    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlan> updatePlan(
            @PathVariable Long id,
            @RequestBody SubscriptionPlan plan) {

        return ResponseEntity.ok(
                service.updatePlan(id, plan)
        );
    }

    // Delete plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable Long id) {

        service.deletePlan(id);

        return ResponseEntity.noContent().build();
    }
}