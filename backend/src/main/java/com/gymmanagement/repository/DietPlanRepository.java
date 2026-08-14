package com.gymmanagement.repository;

import com.gymmanagement.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DietPlanRepository
        extends JpaRepository<DietPlan, Long> {

    Optional<DietPlan> findByMemberId(Long memberId);
}