package com.gymmanagement.service;

import com.gymmanagement.dto.DietRequest;
import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DietService {

    private final Client client;

    public DietService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }



    public String generateDiet(DietRequest request) {

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

        try {

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3.6-flash",
                            prompt,
                            null
                    );

            return response.text();

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
}