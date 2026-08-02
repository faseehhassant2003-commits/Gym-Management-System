package com.gymmanagement.controller;

import com.gymmanagement.dto.DietRequest;
import com.gymmanagement.service.DietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/diet")

public class DietController {
    @Autowired
    private DietService dietService;

    @PostMapping("/generate")
    public String generateDiet(@RequestBody DietRequest request) {

        return dietService.generateDiet(request);


    }}
