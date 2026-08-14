package com.gymmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "workout_plans")
public class WorkoutPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Member who owns this workout plan
    @OneToOne
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    private int age;

    private String gender;

    private double height;

    private double weight;

    private String goal;

    private String experience;

    private int workoutDays;

    private String equipment;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String workoutContent;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}