package com.gymmanagement.controller;

import com.gymmanagement.dto.ChatRequest;
import com.gymmanagement.entity.ChatMessage;
import com.gymmanagement.service.ChatService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // ================================
    // SEND CHAT MESSAGE
    // ================================

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping
    public String chat(@RequestBody ChatRequest request) {

        return chatService.chat(request.getMessage());
    }


    // ================================
    // GET CHAT HISTORY
    // ================================

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/history")
    public List<ChatMessage> getChatHistory() {

        return chatService.getChatHistory();
    }

    // ================================
// CLEAR CHAT HISTORY
// ================================

    @PreAuthorize("hasRole('MEMBER')")
    @DeleteMapping("/history")
    public void clearChatHistory() {

        chatService.clearChatHistory();
    }
}