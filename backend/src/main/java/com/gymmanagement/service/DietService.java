package com.gymmanagement.service;

import com.gymmanagement.dto.DietRequest;
import com.gymmanagement.entity.DietPlan;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.DietPlanRepository;
import com.gymmanagement.repository.MemberRepository;

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
public class DietService {

    private final Client client;

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private MemberRepository memberRepository;


    public DietService(
            @Value("${gemini.api.key}") String apiKey
    ) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }


    public String generateDiet(DietRequest request) {

        // =====================================================
        // 1. GET LOGGED-IN MEMBER
        // =====================================================

        Member member = getAuthenticatedMember();


        // =====================================================
        // 2. CREATE AI PROMPT
        // =====================================================

        String prompt = String.format("""
You are an expert nutritionist and fitness coach.

Create a personalized diet plan in Markdown for the following member.

Age: %d
Gender: %s
Height: %.1f cm
Weight: %.1f kg
Goal: %s
Activity Level: %s
Diet Preference: %s

Requirements:

- Keep the response between 350 and 500 words.
- Be practical and easy to follow.
- Mention approximate quantities only.
- Avoid long explanations.

Return in this format:

# 🥗 Personalized AI Diet Plan

## 👤 Member Summary

- Age
- Gender
- Height
- Weight
- Goal

## 🔥 Daily Nutrition Target

- Calories
- Protein
- Carbohydrates
- Fats
- Water Intake

## 🍽 Meal Plan

### Breakfast

### Lunch

### Evening Snack

### Dinner

## 💪 Pre & Post Workout Nutrition

## 🚫 Foods To Avoid

## 💡 5 Nutrition Tips

## 💬 Motivation

Return ONLY the Markdown diet plan.
""",
                request.getAge(),
                request.getGender(),
                request.getHeight(),
                request.getWeight(),
                request.getGoal(),
                request.getActivityLevel(),
                request.getDietPreference()
        );


        // =====================================================
        // 3. GENERATE DIET WITH GEMINI
        // =====================================================

        try {

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3.6-flash",
                            prompt,
                            null
                    );

            String dietContent = response.text();


            // =================================================
            // 4. FIND EXISTING DIET FOR MEMBER
            // =================================================

            DietPlan dietPlan =
                    dietPlanRepository
                            .findByMemberId(member.getId())
                            .orElse(new DietPlan());


            // =================================================
            // 5. CONNECT DIET TO MEMBER
            // =================================================

            dietPlan.setMember(member);


            // =================================================
            // 6. SAVE INPUT DETAILS
            // =================================================

            dietPlan.setAge(request.getAge());
            dietPlan.setHeight(request.getHeight());
            dietPlan.setWeight(request.getWeight());
            dietPlan.setGender(request.getGender());
            dietPlan.setGoal(request.getGoal());
            dietPlan.setActivityLevel(request.getActivityLevel());
            dietPlan.setDietPreference(request.getDietPreference());


            // =================================================
            // 7. SAVE AI GENERATED CONTENT
            // =================================================

            dietPlan.setDietContent(dietContent);


            // =================================================
            // 8. SAVE DATES
            // =================================================

            if (dietPlan.getCreatedAt() == null) {
                dietPlan.setCreatedAt(LocalDateTime.now());
            }

            dietPlan.setUpdatedAt(LocalDateTime.now());


            // =================================================
            // 9. SAVE TO MYSQL
            // =================================================

            dietPlanRepository.save(dietPlan);


            // =================================================
            // 10. RETURN TO FRONTEND
            // =================================================

            return dietContent;


        } catch (ServerException e) {

            return """
# ⚠ AI Service Busy

The Gemini AI service is currently experiencing high demand.

Please wait a few seconds and try again.

This is a temporary issue from Google's servers.
""";

        } catch (ClientException e) {

            return e.getMessage();

        } catch (Exception e) {

            e.printStackTrace();

            return """
# ❌ Unexpected Error

An unexpected error occurred while generating the diet plan.

Please try again later.
""";
        }
    }


    // =========================================================
    // GET CURRENT MEMBER'S SAVED DIET
    // =========================================================

    public DietPlan getMyDiet() {

        Member member = getAuthenticatedMember();

        return dietPlanRepository
                .findByMemberId(member.getId())
                .orElse(null);
    }


    // =========================================================
    // GET AUTHENTICATED MEMBER
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
}