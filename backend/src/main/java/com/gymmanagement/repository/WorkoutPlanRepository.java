package com.gymmanagement.repository;

import com.gymmanagement.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkoutPlanRepository
        extends JpaRepository<WorkoutPlan, Long> {

    Optional<WorkoutPlan> findByMemberId(Long memberId);
}