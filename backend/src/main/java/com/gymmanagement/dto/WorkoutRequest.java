package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutRequest {
    private int age;
    private String gender;
    private double height;
    private double weight;
    private String goal;
    private String experience;
    private int workoutDays;
    private String equipment;
}
