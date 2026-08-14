package com.gymmanagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "diet_plans")
public class DietPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "member_id",
            nullable = false,
            unique = true
    )
    private Member member;

    private int age;

    private double height;

    private double weight;

    private String gender;

    private String goal;

    private String activityLevel;

    private String dietPreference;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String dietContent;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}