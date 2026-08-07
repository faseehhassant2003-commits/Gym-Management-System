package com.gymmanagement.controller;


import com.gymmanagement.dto.WorkoutRequest;
import com.gymmanagement.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/workout")
@CrossOrigin
public class WorkoutController {
    @Autowired
    private WorkoutService workoutService;


    @PostMapping ("/generate")
    public String generateWorkout(@RequestBody WorkoutRequest request){
        return workoutService.generateWorkout(request);
    }


}
