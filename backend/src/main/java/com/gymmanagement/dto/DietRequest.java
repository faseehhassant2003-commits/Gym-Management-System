package com.gymmanagement.dto;

import lombok.Data;

@Data
public class DietRequest {
    private Long memberId;
    private int age;
    private double height;
    private double weight;
    private String gender;
    private String goal;
    private String activityLevel;
    private String dietPreference;
}
