package com.gymmanagement.service;

import com.gymmanagement.dto.WorkoutRequest;
import com.gymmanagement.entity.Member;
import com.gymmanagement.entity.WorkoutPlan;
import com.gymmanagement.repository.MemberRepository;
import com.gymmanagement.repository.WorkoutPlanRepository;
import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class WorkoutService {

    private final Client client;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private MemberRepository memberRepository;


    public WorkoutService(
            @Value("${gemini.api.key}") String apiKey
    ) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }


    public String generateWorkout(WorkoutRequest request) {

        // =====================================================
        // 1. GET LOGGED-IN MEMBER
        // =====================================================

        Member member = getAuthenticatedMember();


        // =====================================================
        // 2. CREATE AI PROMPT
        // =====================================================

        String prompt = String.format("""
You are a professional fitness trainer with 15 years of experience.

Create a personalized workout plan.

Member Details:
Age: %d
Gender: %s
Height: %.1f cm
Weight: %.1f kg
Goal: %s
Experience: %s
Workout Days: %d
Equipment: %s

Return the response in Markdown.

Include:

# Personalized Workout Plan

## Member Summary

## Weekly Workout Schedule

Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday

For each workout include:
- Exercises
- Sets
- Reps
- Rest Time

Also include:

- Warm-up
- Cardio
- Stretching
- Progressive Overload Tips
- Recovery Tips
- Motivation

Keep the response professional and under 600 words.
""",
                request.getAge(),
                request.getGender(),
                request.getHeight(),
                request.getWeight(),
                request.getGoal(),
                request.getExperience(),
                request.getWorkoutDays(),
                request.getEquipment()
        );


        // =====================================================
        // 3. GENERATE WORKOUT WITH GEMINI
        // =====================================================

        try {

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3-flash-preview",
                            prompt,
                            null
                    );

            String workoutContent = response.text();


            // =================================================
            // 4. FIND EXISTING WORKOUT FOR MEMBER
            // =================================================

            WorkoutPlan workoutPlan =
                    workoutPlanRepository
                            .findByMemberId(member.getId())
                            .orElse(new WorkoutPlan());


            // =================================================
            // 5. CONNECT WORKOUT TO MEMBER
            // =================================================

            workoutPlan.setMember(member);


            // =================================================
            // 6. SAVE INPUT DETAILS
            // =================================================

            workoutPlan.setAge(request.getAge());
            workoutPlan.setGender(request.getGender());
            workoutPlan.setHeight(request.getHeight());
            workoutPlan.setWeight(request.getWeight());
            workoutPlan.setGoal(request.getGoal());
            workoutPlan.setExperience(request.getExperience());
            workoutPlan.setWorkoutDays(request.getWorkoutDays());
            workoutPlan.setEquipment(request.getEquipment());


            // =================================================
            // 7. SAVE AI GENERATED CONTENT
            // =================================================

            workoutPlan.setWorkoutContent(workoutContent);


            // =================================================
            // 8. SAVE DATE
            // =================================================

            if (workoutPlan.getCreatedAt() == null) {
                workoutPlan.setCreatedAt(LocalDateTime.now());
            }

            workoutPlan.setUpdatedAt(LocalDateTime.now());


            // =================================================
            // 9. SAVE TO MYSQL
            // =================================================

            workoutPlanRepository.save(workoutPlan);


            // =================================================
            // 10. RETURN WORKOUT TO FRONTEND
            // =================================================

            return workoutContent;


        } catch (ServerException e) {

            return "# AI service is currently busy. Please try again later.";

        } catch (ClientException e) {

            return e.getMessage();

        } catch (Exception e) {

            e.printStackTrace();

            return "# Unexpected error occurred.";
        }
    }


    // =========================================================
    // GET CURRENT AUTHENTICATED MEMBER
    // =========================================================

    private Member getAuthenticatedMember() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication == null ||
                        authentication.getName() == null
        ) {

            throw new RuntimeException(
                    "Authenticated user not found."
            );
        }


        String email =
                authentication.getName();


        return memberRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member profile not found for current user."
                        )
                );
    }
    public WorkoutPlan getMyWorkout() {

        Member member = getAuthenticatedMember();

        return workoutPlanRepository
                .findByMemberId(member.getId())
                .orElse(null);
    }

}