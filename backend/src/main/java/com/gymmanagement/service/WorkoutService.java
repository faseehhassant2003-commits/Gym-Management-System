package com.gymmanagement.service;

import com.gymmanagement.dto.WorkoutRequest;
import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WorkoutService {

    private final Client client;

    public WorkoutService(@Value("${gemini.api.key}") String apiKey) {
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String generateWorkout(WorkoutRequest request) {

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

        try {

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3-flash-preview",
                            prompt,
                            null
                    );

            return response.text();

        } catch (ServerException e) {

            return "# AI service is currently busy. Please try again later.";

        } catch (ClientException e) {

            return e.getMessage();

        } catch (Exception e) {

            e.printStackTrace();
            return "# Unexpected error occurred.";
        }
    }
}