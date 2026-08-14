package com.gymmanagement.controller;

import com.gymmanagement.dto.WorkoutRequest;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/workout")
@CrossOrigin
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/generate")
    public String generateWorkout(
            @RequestBody WorkoutRequest request
    ) {
        return workoutService.generateWorkout(request);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/my")
    public WorkoutPlan getMyWorkout() {
        return workoutService.getMyWorkout();
    }
}