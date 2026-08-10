package com.gymmanagement.service;
import com.gymmanagement.entity.SubscriptionPlan;
import com.gymmanagement.repository.SubscriptionPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository repository;

    public SubscriptionPlanService(
            SubscriptionPlanRepository repository) {
        this.repository = repository;
    }

    // Get all subscription plans
    public List<SubscriptionPlan> getAllPlans() {
        return repository.findAll();
    }

    // Get only active plans
    public List<SubscriptionPlan> getActivePlans() {
        return repository.findByActiveTrue();
    }

    // Get one plan by ID
    public SubscriptionPlan getPlanById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Subscription plan not found"
                        )
                );
    }

    // Create a new plan
    public SubscriptionPlan createPlan(
            SubscriptionPlan plan) {

        // Check duplicate plan name
        if (repository.findByName(plan.getName()).isPresent()) {
            throw new RuntimeException(
                    "Subscription plan already exists"
            );
        }

        // Validate duration
        if (plan.getDurationDays() == null ||
                plan.getDurationDays() <= 0) {

            throw new RuntimeException(
                    "Duration must be greater than 0"
            );
        }

        // Validate price
        if (plan.getPrice() == null ||
                plan.getPrice() < 0) {

            throw new RuntimeException(
                    "Price cannot be negative"
            );
        }

        return repository.save(plan);
    }

    // Update an existing plan
    public SubscriptionPlan updatePlan(
            Long id,
            SubscriptionPlan updatedPlan) {

        SubscriptionPlan existingPlan =
                getPlanById(id);

        existingPlan.setName(
                updatedPlan.getName()
        );

        existingPlan.setDurationDays(
                updatedPlan.getDurationDays()
        );

        existingPlan.setPrice(
                updatedPlan.getPrice()
        );

        existingPlan.setDescription(
                updatedPlan.getDescription()
        );

        existingPlan.setActive(
                updatedPlan.isActive()
        );

        return repository.save(existingPlan);
    }

    // Delete a plan
    public void deletePlan(Long id) {

        SubscriptionPlan plan =
                getPlanById(id);

        repository.delete(plan);
    }
}