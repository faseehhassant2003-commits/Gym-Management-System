package com.gymmanagement.service;

import org.springframework.transaction.annotation.Transactional;

import com.gymmanagement.entity.ChatMessage;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.ChatMessageRepository;
import com.gymmanagement.repository.MemberRepository;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;
    private final Client client;

    public ChatService(
            ChatMessageRepository chatMessageRepository,
            MemberRepository memberRepository,
            @Value("${gemini.api.key}") String apiKey
    ) {
        this.chatMessageRepository = chatMessageRepository;
        this.memberRepository = memberRepository;

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String chat(String message) {

        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        // Get logged-in user's email from JWT authentication
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find member using email
        Member member = memberRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Member not found"));

        // Save user's message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setMember(member);
        userMessage.setSender("USER");
        userMessage.setMessage(message.trim());
        userMessage.setCreatedAt(java.time.LocalDateTime.now());

        chatMessageRepository.save(userMessage);

        // Get previous conversation
        List<ChatMessage> history =
                chatMessageRepository
                        .findByMemberIdOrderByCreatedAtAsc(member.getId());

        // Build conversation context
        StringBuilder conversation = new StringBuilder();

        conversation.append("""
                You are the AI Fitness Assistant for a gym management system.

                You help gym members with:
                - Fitness
                - Workouts
                - Exercise explanations
                - Basic nutrition
                - Gym-related questions
                - General wellness guidance

                Give clear, friendly and practical answers.

                Do not claim to be a doctor.
                For serious medical conditions, injuries or emergencies,
                recommend consulting a qualified healthcare professional.

                Conversation history:

                """);

        for (ChatMessage chatMessage : history) {

            conversation
                    .append(chatMessage.getSender())
                    .append(": ")
                    .append(chatMessage.getMessage())
                    .append("\n");
        }

        conversation.append("\nAI:");

        // Send conversation to Gemini
        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        conversation.toString(),
                        null
                );

        String aiResponse = response.text();

        // Save AI response
        ChatMessage aiMessage = new ChatMessage();

        aiMessage.setMember(member);
        aiMessage.setSender("AI");
        aiMessage.setMessage(aiResponse);
        aiMessage.setCreatedAt(java.time.LocalDateTime.now());

        chatMessageRepository.save(aiMessage);

        return aiResponse;
    }
    // ================================
    // GET CHAT HISTORY
    // ================================

    public List<ChatMessage> getChatHistory() {

        // Get logged-in user's email from JWT authentication
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find the logged-in member
        Member member = memberRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Member not found"));

        // Get this member's chat history
        return chatMessageRepository
                .findByMemberIdOrderByCreatedAtAsc(member.getId());
    }
    // ================================
// CLEAR CHAT HISTORY
// ================================
    @Transactional
    public void clearChatHistory() {

        // Get logged-in user's email from JWT authentication
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find the logged-in member
        Member member = memberRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Member not found"));

        // Delete only this member's messages
        chatMessageRepository.deleteByMemberId(member.getId());
    }

}