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
You are a certified nutritionist, sports dietitian, and fitness coach with over 15 years of experience.

Your task is to create a highly professional, personalized diet plan for a gym member.

========================
MEMBER DETAILS
========================

Age: %d years
Gender: %s
Height: %.1f cm
Weight: %.1f kg
Fitness Goal: %s
Activity Level: %s
Diet Preference: %s

========================
INSTRUCTIONS
========================

1. Return the response in VALID MARKDOWN.
2. Use proper headings (#, ##, ###).
3. Use bullet points.
4. Use tables wherever suitable.
5. Make the response beautiful, professional and easy to read.
6. Do not use unnecessary long paragraphs.
7. Recommend healthy and realistic foods.
8. Mention approximate quantities.
9. Mention approximate calories.
10. Mention approximate protein, carbohydrates and fats.
11. Give practical advice instead of generic advice.
12. If the height or weight is unrealistic, politely mention it and continue using reasonable assumptions.
13. Keep the response between 600-900 words.

========================
OUTPUT FORMAT
========================

# 🥗 Personalized AI Diet Plan

## 👤 Member Summary

Display as a table.

| Attribute | Value |
|-----------|-------|
| Age | |
| Gender | |
| Height | |
| Weight | |
| Goal | |
| Activity Level | |
| Diet Preference | |

---

## 📊 BMI Analysis

Display as a table.

| Metric | Value |
|--------|-------|
| BMI |
| Category |
| Ideal Weight Range |

Provide a short explanation.

---

## 🔥 Daily Nutrition Target

| Nutrient | Recommended Intake |
|----------|--------------------|
| Calories |
| Protein |
| Carbohydrates |
| Fats |
| Fiber |
| Water Intake |

---

## 🍳 Breakfast

| Food | Quantity | Calories |

Include one healthy alternative.

---

## 🍎 Mid-Morning Snack

| Food | Quantity | Calories |

---

## 🍗 Lunch

| Food | Quantity | Calories |

Include vegetables.

---

## ☕ Evening Snack

| Food | Quantity | Calories |

---

## 🍲 Dinner

| Food | Quantity | Calories |

---

## 💪 Pre-Workout Meal

- Best foods
- Quantity
- Timing before workout

---

## 🥤 Post-Workout Meal

- Best foods
- Quantity
- Timing after workout

---

## 💊 Recommended Supplements

| Supplement | Purpose | Suggested Daily Intake |

Mention that supplements should only be taken after consulting a healthcare professional.

---

## 🚫 Foods To Avoid

Use bullet points.

---

## 🏋 Weekly Nutrition Tips

Provide 8 practical tips.

---

## 😴 Recovery Tips

Include:

- Sleep duration
- Stress management
- Hydration
- Meal timing

---

## 📅 Weekly Cheat Meal Recommendation

Explain:

- How many cheat meals
- Portion control
- Best day

---

## 💬 Motivation Message

Write a short motivational message suitable for someone trying to achieve the selected fitness goal.

========================
IMPORTANT
========================

Generate recommendations specifically for the member's:

- Age
- Gender
- Height
- Weight
- Goal
- Activity Level
- Diet Preference

Avoid generic advice.
Return ONLY the diet plan.
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
                            "gemini-3-flash-preview",
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

            return """
# ⚠ Daily AI Limit Reached

The free Gemini API quota has been exhausted.

Please try again later or use a different API key.

Your application is working correctly. The request was rejected because the free-tier usage limit has been reached.
""";

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