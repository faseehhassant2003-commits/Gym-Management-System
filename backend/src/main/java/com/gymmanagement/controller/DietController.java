package com.gymmanagement.controller;

import com.gymmanagement.dto.DietRequest;
import com.gymmanagement.entity.DietPlan;
import com.gymmanagement.service.DietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/diet")
public class DietController {

    @Autowired
    private DietService dietService;

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/generate")
    public String generateDiet(@RequestBody DietRequest request) {
        return dietService.generateDiet(request);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/my")
    public DietPlan getMyDiet() {
        return dietService.getMyDiet();
    }
}